import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import map from '@f/store/map';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import {authorize, sortByProperty} from '@f/utils';
import './styles.scss';

import Topbar from '@f/containers/Topbar';
import QRReader from '@f/components/QRReader';
import ScanModal from '@f/components/ScanModal';

class HackersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      scan: {
        name: '',
        attribute: ''
      },
      loaded: false,
      showScanner: false,
      unauthorized: false
    };

    this.scanModal = React.createRef();

    this.onSearchChange = this.onSearchChange.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.openHackerPage = this.openHackerPage.bind(this);
    this.onSearchForChange = this.onSearchForChange.bind(this);
  }

  componentDidUpdate() {
    authorize(this.props.history);
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  showScanner() {
    this.setState({showScanner: true}, () => {
      document.addEventListener('click', this.hideScanner);
    });
  }

  hideScanner() {
    this.setState({showScanner: false}, () => {
      document.removeEventListener('click', this.hideScanner);
    });
  }

  onQRScan(qr) {
    if (!this.state.scan.name) {
      this.props.history.push(`/hackers/${qr}`);
      return;
    }

    // Attempt to scan for a particular field
    let token = this.props.store.token;
    this.hideScanner();
    this.scanModal.current.openModal();

    axios.post(`/api/hackers/${qr}/toggle`, this.state.scan, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (res && res.data && res.data.message) {
        this.scanModal.current.onSuccess();
        return;
      }

      this.scanModal.current.onError(res.data.error || 'There was an error toggling this field');
    });
  }

  onQRError(error) {
    console.error(error);
  }

  openHackerPage(qr) {
    if (!this.state.showScanner) {
      this.props.history.push(`/hackers/${qr}`);
    }
  }

  onSearchForChange(name, attribute) {
    this.setState({scan: {name: name, attribute: attribute}});
  }

  render() {
    let roles = this.props.store.roles.filter(role => {
      return this.props.store.hackers.find(hacker => {
        return hacker.role == role._id;
      });
    }).map(role => (
      <div key={role._id}>
        <a className="dropdown-item" onClick={() => this.onSearchForChange('', '')}>None</a>
        {
          role.fields.map(field => (
            <div key={field.name}>
              <h6 className="dropdown-header">{field.name}</h6>
              {
                field.attributes.map(attribute => (
                  <a key={`${field.name}-${attribute}`} className="dropdown-item" onClick={() => this.onSearchForChange(field.name, attribute)}>{attribute}</a>
                ))
              }
            </div>
          ))
        }
      </div>
    ));

    let search = this.state.search.toLowerCase();
    let hackers = this.props.store.hackers.filter(hacker => {
      return hacker.active;
    }).filter(hacker => {
      let matchName = hacker ? hacker.name.toLowerCase().includes(search) : false;
      let matchEmail = hacker ? hacker.email.toLowerCase().includes(search) : false

      return hacker ? matchName || matchEmail : false;
    }).sort(sortByProperty('name')).map(hacker => (
      <button className="list-group-item" key={hacker.qr} onClick={() => this.openHackerPage(hacker.qr)}>{hacker.name} ({hacker.email})</button>
    ));

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className={`content tall${this.state.showScanner ? ' blur' : ''}`}>
        <Topbar home/>
        <div className="content tall">
          <div id="pageBar">
            <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search..."/>

            <div className="row">
              <button id="scanQRButton" className="btn btn-blank" onClick={this.showScanner} aria-label="Scan qr code">
                <div className="column row-center">
                  <div className="row row-center">
                    <FontAwesomeIcon icon={faCamera}/>
                    </div>
                </div>
              </button>

              <div id="filterButton" className="dropdown">
                <button className={`btn btn-${this.state.scan.name === '' ? 'blank' : 'success'}`} type="button" id="dropdownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FontAwesomeIcon icon={faCheckSquare}/>
                </button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownButton">
                  {roles}
                </div>
              </div>
            </div>
          </div>

          <div className="list-group">
            {hackers}
          </div>
        </div>

        {scanner}
        <ScanModal ref={this.scanModal}/>
      </div>
    );
  }
};

export default connect(map)(withRouter(HackersPage));

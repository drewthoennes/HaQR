import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import map from '@f/store/map';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faCheckSquare} from '@fortawesome/free-solid-svg-icons';
import socket from '@f/socket';
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
    this.onSearchForCheckin = this.onSearchForCheckin.bind(this);
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
    if (this.state.scan !== 'checkin' && !this.state.scan.name) {
      this.props.history.push(`/hackers/${qr}`);
      return;
    }

    // Attempt to scan for a particular field
    let token = this.props.store.token;
    this.hideScanner();
    this.scanModal.current.openModal();

    let endpoint = `/api/hackers/${qr}/${this.state.scan === 'checkin' ? 'checkin' : 'toggle'}`;

    axios.post(endpoint, this.state.scan, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (res && res.data && res.data.message) {
        if (this.state.scan === 'checkin') {
          this.scanModal.current.onSuccess(`Checked in hacker`);
          socket.emit('updatedHackers', token);
        }
        else {
          this.scanModal.current.onSuccess(`Updated field ${this.state.scan.attribute}`);
        }

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

  onSearchForChange(event) {
    if (event.target.value === 'checkin') {
      this.setState({scan: event.target.value});
    }
    else {
      this.setState({scan: JSON.parse(event.target.value)});
    }
  }

  onSearchForCheckin() {
    this.setState({scan: 'checkin'});
  }

  render() {
    let checkin = '';

    if (this.props.store.hackers.find(hacker => {
      return hacker && hacker.checkin && hacker.checkin.enabled;
    })) {
      checkin = (<option onClick={this.onSearchForCheckin} value="checkin">Check-in</option>);
    }

    let roles = this.props.store.roles.filter(role => {
      return this.props.store.hackers.find(hacker => {
        return hacker.role == role._id;
      });
    }).map(role => {
      return role.fields.map(field => {
        let options = [];

        options.push(<option key={field.name} disabled>{field.name}</option>);
        options = options.concat(
          field.attributes.map(attribute => (
            <option key={`${field.name}-${attribute}`} value={JSON.stringify({name: field.name, attribute: attribute})}>{attribute}</option>
          ))
        );

        return options;
      });
    });

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

    if (hackers.length === 0) {
      hackers = (
        <div className="card row">
          <div className="card-body">
            <h5 className="card-title row row-between">No active hackers</h5>
            <p>Add or activate some hackers to get started</p>
          </div>
        </div>
      );
    }

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className={`content ${this.state.showScanner ? ' blur' : ''}`}>
        <Topbar home/>
        <div className="content">
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

              <select id="filterSelector" className="form-control" onChange={this.onSearchForChange}>
                <option className="dropdown-item" value={JSON.stringify({name: '', attribute: ''})}>None</option>
                {checkin}
                {roles}
              </select>

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

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import store from '@/store';
import {removeToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faUser} from '@fortawesome/free-solid-svg-icons';
import {authorize} from '@/utils';
import './styles.scss';

import Topbar from '@/containers/Topbar';
import QRReader from '@/components/QRReader';

class HackersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      loaded: false,
      showScanner: false,
      unauthorized: false
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.openHackerPage = this.openHackerPage.bind(this);
  }

  componentDidUpdate() {
    authorize(this.props.history);
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  showScanner() {
    this.setState({showScanner: true});
  }

  hideScanner() {
    this.setState({showScanner: false});
  }

  onQRScan(data) {
    this.props.history.push(`/hackers/${data}`);
  }

  onQRError(error) {
    console.error(error);
  }
  
  openHackerPage(qr) {
    this.props.history.push(`/hackers/${qr}`);
  }
  render() {

    let search = this.state.search.toLowerCase();
    let hackers = this.props.store.hackers.filter(hacker => {
      return hacker.active;
    }).filter(hacker => {
      return hacker ? hacker.name.toLowerCase().includes(search) : false;
    }).map(hacker => (
      <button className="list-group-item" key={hacker.qr} onClick={() => this.openHackerPage(hacker.qr)}>{hacker.name} ({hacker.email})</button>
    ));

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className="tall column">
        <Topbar/>
        <div className={`content tall${this.state.showScanner ? ' blur' : ''}`}>
          <div className="row">
            <input className="form-control" type="text" value={this.state.search} onChange={this.onSearchChange} placeholder="Search..."/>
            <button className="btn" onClick={this.showScanner}>
              <div className="column justify-contents-center">
                <FontAwesomeIcon icon={faCamera}/>
              </div>
            </button>
          </div>

          <div className="list-group">
            {hackers}
          </div>
        </div>

        {scanner}
      </div>
    );
  }
};

export default connect(map)(withRouter(HackersPage));

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import store from '@/store';
import {removeToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faUser} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

import QRReader from '@/components/QRReader';

class HackersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hackers: [],
      search: '',
      loaded: false,
      showScanner: false,
      unauthorized: false
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.getHackers = this.getHackers.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.openHackerPage = this.openHackerPage.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.getHackers();
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  getHackers() {
    axios.get('/api/hackers', {
      headers: {
        Authorization: `token ${this.props.account.token}`
      }
    }).then(res => {
      console.log(res.data.status);

      if (res.data.hackers) {
        this.setState({hackers: res.data.hackers});
      }
      else {
        console.error('Could not retrieve hackers list');
      }
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/unauthorized');
      }
    });
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

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    let search = this.state.search.toLowerCase();
    let hackers = this.state.hackers.filter(hacker => {
      return hacker ? hacker.name.toLowerCase().includes(search) : false;
    }).map(hacker => (
      <button className="list-group-item" key={hacker.qr} onClick={() => this.openHackerPage(hacker.qr)}>{hacker.name} ({hacker.email})</button>
    ));

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className="tall">
        <div className="sidebar"></div>
        <div className={`content tall${this.state.showScanner ? ' blur' : ''}`}>
          <div className="row">
            <input className="form-control" type="text" value={this.state.search} onChange={this.onSearchChange} placeholder="Search..."/>
            <div>
              <button className="btn" onClick={this.showScanner}>
                <div className="column justify-contents-center">
                  <FontAwesomeIcon icon={faCamera}/>
                </div>
              </button>
              <button className="btn" onClick={this.logout}>
                <div className="column justify-contents-center">
                  <FontAwesomeIcon icon={faUser}/>
                </div>
              </button>
            </div>
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

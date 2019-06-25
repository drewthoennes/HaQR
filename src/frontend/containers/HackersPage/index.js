import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import store from '@/store';
import {removeToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import './styles.scss';

import QRReader from '@/components/QRReader';

class HackersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hackers: [],
      loaded: false,
      showScanner: false
    };

    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.getHackers = this.getHackers.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log(this.props.account.token);
    this.getHackers();
  }

  getHackers() {
    axios.get('/api/hackers', {
      headers: {
        Authorization: `token ${this.props.account.token}`
      }
    }).then(res => {
      if (res.data.hackers) {
        this.setState({hackers: res.data.hackers});
      }
      else {
        console.error('Could not retrieve hackers list');
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
    console.log(data);
  }

  onQRError(error) {
    console.error(error);
  }

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    let hackers = this.state.hackers.map(hacker => (
      <p key={hacker.qr}>{hacker.name} ({hacker.email})</p>
    ));

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className="tall">
        <div className={`content tall ${this.state.showScanner ? 'blur' : ''}`}>
          {hackers}
          <button onClick={this.showScanner}>Show scanner</button>
          <button onClick={this.logout}>Logout</button>
        </div>

        {scanner}
      </div>
    );
  }
};

export default connect(map)(withRouter(HackersPage));

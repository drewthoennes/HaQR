import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import socket from '@/socket';
import './styles.scss';

class _settingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.toggleAuthorizeAll = this.toggleAuthorizeAll.bind(this);
    this.togglePromoteAll = this.togglePromoteAll.bind(this);
  }

  componentDidMount() {
  }

  toggleAuthorizeAll() {
    let token = this.props.token;

    axios.post('/api/config', {
      config: {
        ...this.props.config,
        authorizeAll: !this.props.config.authorizeAll
      }
    }, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data) {
          throw new Error('There was an error retrieving the config');
      }

      socket.emit('updatedConfig', token);
    }).catch(err => {
    });
  }

  togglePromoteAll() {
    let token = this.props.token;

    axios.post('/api/config', {
      config: {
        ...this.props.config,
        promoteAll: !this.props.config.promoteAll
      }
    }, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data) {
          throw new Error('There was an error retrieving the config');
      }

      socket.emit('updatedConfig', token);
    }).catch(err => {
    });
  }

  render() {
    return (
      <div id="_settingsView" className="tall">
        <div className="card">
          <div className="card-header"><h5>Application Settings</h5></div>
          <div className="card-body">
            <div className="setting">
              <div className="column justify-content-center"><h6>Authorize all new users</h6></div>
              <button className={`btn ${this.props.config.authorizeAll ? 'btn-success' : 'btn-danger'}`} onClick={this.toggleAuthorizeAll}>{this.props.config.authorizeAll ? 'Enabled' : 'Disabled'}</button>
            </div>
            <h2 className="horizontal-line"></h2>
            <div className="setting">
              <div className="column justify-content-center"><h6>Promote all new users</h6></div>
              <button className={`btn ${this.props.config.promoteAll ? 'btn-success' : 'btn-danger'}`} onClick={this.togglePromoteAll}>{this.props.config.promoteAll ? 'Enabled' : 'Disabled'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withRouter(_settingsView);

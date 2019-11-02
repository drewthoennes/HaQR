import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import socket from '@f/socket';
import './styles.scss';

class _settingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.toggleAuthorizeAll = this.toggleAuthorizeAll.bind(this);
    this.togglePromoteAll = this.togglePromoteAll.bind(this);
    this.downloadHackersJSON = this.downloadHackersJSON.bind(this);
    this.downloadHackersCSV = this.downloadHackersCSV.bind(this);
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

  downloadHackersJSON() {
    let token = this.props.token;

    axios.get('/api/hackers', {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data || !res.data.hackers) return;

      // Referenced from https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2

      let filename = 'hackers.json';
      let contentType = 'application/json;charset=utf-8;';

      let blob = new Blob([JSON.stringify(res.data.hackers)], {type: contentType});

      if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, exportedFilenmae);
      }
      else {
          let a = document.createElement('a');
          if (a.download !== undefined) {
              let url = URL.createObjectURL(blob);
              a.setAttribute('href', url);
              a.setAttribute('download', filename);
              a.style.visibility = 'hidden';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          }
      }
    });
  }

  downloadHackersCSV() {
    let token = this.props.token;

    axios.get('/api/hackers', {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data || !res.data.hackers) return;

      let csv = '';
      res.data.hackers.forEach(hacker => {
        csv += `${hacker.name}, ${hacker.email}, ${hacker.qr}\r\n`;
      });

      // Referenced from https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2

      let filename = 'hackers.csv';
      let contentType = 'text/csv;charset=utf-8;';
      let blob = new Blob([csv], {type: contentType});

      if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, exportedFilenmae);
      }
      else {
          let a = document.createElement('a');
          if (a.download !== undefined) {
              let url = URL.createObjectURL(blob);
              a.setAttribute('href', url);
              a.setAttribute('download', filename);
              a.style.visibility = 'hidden';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
          }
      }
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
              <button className={`btn btn-${this.props.config && this.props.config.authorizeAll ? 'success' : 'danger'}`} onClick={this.toggleAuthorizeAll}>{this.props.config && this.props.config.authorizeAll ? 'Enabled' : 'Disabled'}</button>
            </div>
            <h2 className="horizontal-line"></h2>
            <div className="setting">
              <div className="column justify-content-center"><h6>Promote all new users</h6></div>
              <button className={`btn btn-${this.props.config && this.props.config.promoteAll ? 'success' : 'danger'}`} onClick={this.togglePromoteAll}>{this.props.config && this.props.config.promoteAll ? 'Enabled' : 'Disabled'}</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h5>Export Hackers</h5></div>
          <div className="card-body">
            <div className="setting">
              <div className="column justify-content-center"><h6>Export hackers as JSON</h6></div>
              <button className={`btn btn-gray`} onClick={this.downloadHackersJSON}>Export</button>
            </div>
            <h2 className="horizontal-line"></h2>
            <div className="setting">
              <div className="column justify-content-center"><h6>Export hackers as CSV</h6></div>
              <button className={`btn btn-gray`} onClick={this.downloadHackersCSV}>Export</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default withRouter(_settingsView);

import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import socket from '@f/socket';
import './styles.scss';

class _settingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasUpdated: true
    };

    this.toggleSetting = this.toggleSetting.bind(this);
    this.downloadHackersJSON = this.downloadHackersJSON.bind(this);
    this.downloadHackersCSV = this.downloadHackersCSV.bind(this);
  }

  toggleSetting(name) {
    let token = this.props.token;

    if (this.props.config[name] === undefined) return;
    this.setState({hasUpdated: false});

    axios.post('/api/config', {
      config: {
        ...this.props.config,
        [name]: !this.props.config[name]
      }
    }, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data) {
          throw new Error('There was an error updating the config');
      }

      socket.emit('updatedConfig', token);
      this.setState({hasUpdated: true});
    }).catch(err => {
      this.setState({hasUpdated: true});
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
              <button className={`btn btn-${this.props.config && this.props.config.authorizeAll ? 'success' : 'danger'}`} disabled={!this.state.hasUpdated} onClick={() => this.toggleSetting('authorizeAll')}>{this.props.config && this.props.config.authorizeAll ? 'Enabled' : 'Disabled'}</button>
            </div>

            <h2 className="horizontal-line"></h2>

            <div className="setting">
              <div className="column justify-content-center"><h6>Promote all new users</h6></div>
              <button className={`btn btn-${this.props.config && this.props.config.promoteAll ? 'success' : 'danger'}`} disabled={!this.state.hasUpdated} onClick={() => this.toggleSetting('promoteAll')}>{this.props.config && this.props.config.promoteAll ? 'Enabled' : 'Disabled'}</button>
            </div>

            <h2 className="horizontal-line"></h2>

            <div className="setting">
              <div className="column justify-content-center"><h6>Activate hackers on check-in</h6></div>
              <button className={`btn btn-${this.props.config && this.props.config.activateOnCheckin ? 'success' : 'danger'}`} disabled={!this.state.hasUpdated} onClick={() => this.toggleSetting('activateOnCheckin')}>{this.props.config && this.props.config.activateOnCheckin ? 'Enabled' : 'Disabled'}</button>
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

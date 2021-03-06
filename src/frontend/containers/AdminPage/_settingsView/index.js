import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import socket from '@f/socket';
import './styles.scss';

import AdminSetting from '@f/components/AdminSetting';
import AdminSettingRow from '@f/components/AdminSettingRow';
import AdminActionRow from '@f/components/AdminActionRow';

class _settingsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasUpdated: true
    };

    this.toggleSetting = this.toggleSetting.bind(this);
    this.flushInteractions = this.flushInteractions.bind(this);
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

  flushInteractions() {
    let token = this.props.token;

    axios.delete('/api/interactions', {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedInteractions', token);
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
    let config = this.props.config;

    let interactionSettings;
    if (this.props.account && this.props.account.role === 'owner') {
      interactionSettings = (
        <AdminSetting name="Interaction Settings">
          <AdminActionRow name="Flush all interactions" tooltip="Deletes all existing interactions" button="Flush" hasUpdated={this.state.hasUpdated} action={this.flushInteractions}/>
        </AdminSetting>
      );
    }

    return (
      <div id="_settingsView" className="tall">
        <AdminSetting name="User Settings">
          <AdminSettingRow name="Authorize all new users" setting="authorizeAll" value={config && config.authorizeAll} tooltip="All current interactions will be deleted" hasUpdated={this.state.hasUpdated} toggleSetting={this.toggleSetting}/>
          <h2 className="horizontal-line"></h2>
          <AdminSettingRow name="Promote all new users" setting="promoteAll" value={config && config.promoteAll} tooltip="All new users will automatically be given admin access" hasUpdated={this.state.hasUpdated} toggleSetting={this.toggleSetting}/>
        </AdminSetting>

        <AdminSetting name="Hacker Settings">
          <AdminSettingRow name="Activate hackers on check-in" setting="activateOnCheckin" value={config && config.activateOnCheckin} tooltip="When a user toggles a hacker's check-in field, the hacker will be activated" hasUpdated={this.state.hasUpdated} toggleSetting={this.toggleSetting}/>
          <h2 className="horizontal-line"></h2>
          <AdminSettingRow name="Toggle hackers active on creation" setting="activeOnCreate" value={config && config.activeOnCreate} tooltip="When a hacker is added, it will be automatically activated" hasUpdated={this.state.hasUpdated} toggleSetting={this.toggleSetting}/>
        </AdminSetting>

        {interactionSettings}

        <AdminSetting name="Export Hackers">
          <AdminActionRow name="Export hackers as JSON" tooltip="Downloads a JSON file containing all current hackers" button="Export" hasUpdated={this.state.hasUpdated} action={this.downloadHackersJSON}/>
          <h2 className="horizontal-line"></h2>
          <AdminActionRow name="Export hackers as CSV" tooltip="Downloads a CSV file containing all current hackers" button="Export" hasUpdated={this.state.hasUpdated} action={this.downloadHackersCSV}/>
        </AdminSetting>
      </div>
    );
  }
};

export default withRouter(_settingsView);

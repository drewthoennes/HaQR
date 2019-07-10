import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import socket from '@/socket';
import {parseCSV} from '@/utils';
import './styles.scss';

import QRReader from '@/components/QRReader';

class _addHackersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldsCSV: '',
      fieldsCSVError: undefined,
      hackersCSV: '',
      hackersCSVError: undefined,
      showScanner: false
    };

    this.onFieldsChange = this.onFieldsChange.bind(this);
    this.onHackersChange = this.onHackersChange.bind(this);
    this.checkFieldsFormatting = this.checkFieldsFormatting.bind(this);
    this.checkHackersFormatting = this.checkHackersFormatting.bind(this);
    this.saveHackers = this.saveHackers.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
  }

  onFieldsChange(event) {
    this.setState({fieldsCSV: event.target.value});
  }

  onHackersChange(event) {
    this.setState({hackersCSV: event.target.value});
  }

  checkFieldsFormatting() {
    parseCSV(this.state.fieldsCSV, 2).then(map => {
      this.setState({fieldsCSVError: undefined});
    }).catch(err => {
      this.setState({fieldsCSVError: err});
    });
  }

  checkHackersFormatting() {
    parseCSV(this.state.hackersCSV, 3).then(map => {
      this.setState({hackersCSVError: undefined});
    }).catch(err => {
      this.setState({hackersCSVError: err});
    });
  }

  formatFieldsMap(map) {
    let fields = {};

    for (let el in map) {
      let category = map[el][0];
      let field = map[el][1];

      if (!fields[category]) {
        fields[category] = [];
      }

      fields[category].push({
        had: false,
        name: field
      });
    }

    let formatted = [];

    for (let field in fields) {
      let category = {
        name: field,
        attributes: fields[field]
      };

      formatted.push(category);
    }

    return formatted;
  }

  saveHackers() {
    let token = this.props.token;
    let fields;
    let hackers;

    parseCSV(this.state.fieldsCSV, 2).then(map => {
      fields = this.formatFieldsMap(map);

      return parseCSV(this.state.hackersCSV, 3);
    }).then(map => {
      hackers = map;

      let promises = [];

      hackers.forEach(hacker => {
        let name = hacker[0];
        let email = hacker[1];
        let qr = hacker[2];

        promises.push(
          axios.post('/api/hackers', {
            name: name,
            email: email,
            qr: qr,
            fields: fields
          }, {
            headers: {
              authorization: `token ${token}`
            }
          })
        );
      });

      return Promise.all(promises);
    }).then(() => {
      socket.emit('updatedHackers', token);
      this.setState({fieldsCSV: '', fieldsCSVError: undefined, hackersCSV: '', hackersCSVError: undefined});
    }).catch(err => {
      console.error(err);
    });
  }

  showScanner() {
    this.props.blur();
    this.setState({showScanner: true}, () => {
      document.addEventListener('click', this.hideScanner);
    });
  }

  hideScanner() {
    this.props.unblur();
    this.setState({showScanner: false}, () => {
      document.removeEventListener('click', this.hideScanner);
    });
  }

  onQRScan(data) {
    this.setState({hackersCSV: `${this.state.hackersCSV}${data}`});
    this.hideScanner();
  }

  onQRError(error) {
    console.error(error);
  }

  render() {
    let fieldsError;
    let hackersError;
    let scanner;

    if (this.state.fieldsCSVError) {
      fieldsError = (
        <div className="alert alert-danger" role="alert">{this.state.fieldsCSVError}</div>
      );
    }

    if (this.state.hackersCSVError) {
      hackersError = (
        <div className="alert alert-danger" role="alert">{this.state.hackersCSVError}</div>
      );
    }

    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="_addHackersView" className={`tall${this.props.isBlurred ? ' blur' : ''}`}>
        <div className="cards">
          <div className="card">
            <h5 className="card-header">CSV Hacker Upload</h5>
            <div className="card-body">
              <p className="card-text">CSV Format: Category, Field</p>
              <textarea value={this.state.fieldsCSV} placeholder={"Swag, Backpacks\nSwag, Dad hats\nMeals, Breakfast"} onChange={this.onFieldsChange}></textarea>
              <div className="buttons">
                <button className="btn btn-blank" onClick={this.checkFieldsFormatting}>Check Formatting</button>
              </div>
              {fieldsError}
            </div>
          </div>

          <div className="card">
            <div className="card-header row justify-content-between">
              <div className="column justify-content-center">
                <h5>CSV Hackers Upload</h5>
              </div>
              <button className="btn btn-blank" onClick={this.showScanner}>
                <div className="column justify-content-center">
                  <FontAwesomeIcon icon={faCamera}/>
                </div>
              </button>
            </div>
            <div className="card-body">
              <p className="card-text">CSV Format: Name, Email, QR (required)</p>
              <textarea value={this.state.hackersCSV} placeholder="John Purdue, john@purdue.edu, 834263229619" onChange={this.onHackersChange}></textarea>
              <div id="hackers-buttons" className="buttons">
                <button className="btn btn-blank" onClick={this.checkHackersFormatting}>Check Formatting</button>
                <button className="btn btn-success" onClick={this.saveHackers}>Submit</button>
              </div>
              {hackersError}
            </div>
          </div>
        </div>

        {scanner}
      </div>
    );
  }
};

export default withRouter(_addHackersView);

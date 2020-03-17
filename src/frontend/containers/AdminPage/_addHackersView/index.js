import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faRandom} from '@fortawesome/free-solid-svg-icons';
import insertTextAtCursor from 'insert-text-at-cursor';
import socket from '@f/socket';
import {parseCSV} from '@f/utils';
import './styles.scss';

import QRReader from '@f/components/QRReader';

class _addHackersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      role: '',
      hackersCSV: '',
      hackersCSVError: undefined,
      showScanner: false
    };

    this.onHackersChange = this.onHackersChange.bind(this);
    this.checkHackersFormatting = this.checkHackersFormatting.bind(this);
    this.saveHackers = this.saveHackers.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.setRole = this.setRole.bind(this);
    this.createRandomUniqueQR = this.createRandomUniqueQR.bind(this);
  }

  onHackersChange(event) {
    this.setState({hackersCSV: event.target.value});
  }

  checkHackersFormatting() {
    parseCSV(this.state.hackersCSV, 4).then(map => {
      this.setState({hackersCSVError: undefined});
    }).catch(err => {
      this.setState({hackersCSVError: err.message});
    });
  }

  saveHackers() {
    let token = this.props.token;
    let hackers;

    if (!this.state.role) {
      this.setState({hackersCSVError: 'Please select a role from the dropdown above before submitting'});
      return;
    }

    parseCSV(this.state.hackersCSV, 4).then(map => {
      hackers = map;

      let promises = [];

      hackers.forEach(hacker => {
        let name = hacker[0];
        let email = hacker[1];
        let description = hacker[2];
        let qr = hacker[3];

        promises.push(
          axios.post('/api/hackers', {
            name: name,
            email: email,
            description: description,
            qr: qr,
            role: this.state.role._id
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
      this.setState({role: '', hackersCSV: '', hackersCSVError: undefined, showScanner: false});
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

  setRole(role) {
    this.setState({role: role});
  }

  createRandomUniqueQR() {
    let qr = Math.floor(Math.random() * Math.pow(10, 13));
    let csv = this.state.hackersCSV;

    while (csv.includes(qr) || this.props.hackers.find(hacker => {
      return hacker.qr == qr;
    })) {
      qr = Math.floor(Math.random() * Math.pow(10, 13));
    }

    insertTextAtCursor(document.getElementById('hacker-textarea'), qr);
  }

  render() {
    let hackersError;
    let scanner;
    let roles;

    if (this.state.hackersCSVError) {
      hackersError = (
        <div className="alert alert-danger" role="alert">{this.state.hackersCSVError}</div>
      );
    }

    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    if (this.props.roles) {
      roles = this.props.roles.map(role => (
        <p key={role._id} className="dropdown-item" onClick={() => this.setRole(role)}>{role.name}</p>
      ));
    }

    return (
      <div id="_addHackersView" className={`tall${this.props.isBlurred ? ' blur' : ''}`}>
        <div className="cards">
          <div className="card">
            <div className="card-header">
              <div className="column justify-content-center">
                <h5>Import CSV</h5>
              </div>

              <div className="row row-between">
                <button className="btn btn-blank" onClick={this.showScanner} aria-label="Scan qr code">
                  <div className="row justify-content-center">
                    <div className="column justify-content-center">
                      <FontAwesomeIcon icon={faCamera}/>
                    </div>
                  </div>
                </button>

                <button className="btn btn-blank" onClick={this.createRandomUniqueQR} aria-label="Add random qr code">
                  <div className="row justify-content-center">
                    <div className="column justify-content-center">
                      <FontAwesomeIcon icon={faRandom}/>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="dropdown">
                <button className="btn btn-blank dropdown-toggle" type="button" id="rolesDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.role ? this.state.role.name : 'Select role...'}</button>
                <div className="dropdown-menu" aria-labelledby="rolesDropdown">
                  {roles}
                </div>
              </div>

              <p className="card-text">CSV Format: Name, Email, Description, QR</p>

              <textarea id="hacker-textarea" value={this.state.hackersCSV} placeholder="John Purdue, john@purdue.edu, Early admittance, 834263229619" onChange={this.onHackersChange}></textarea>
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

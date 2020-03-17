import React from 'react';
import {connect} from 'react-redux';
import map from '@f/store/map';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import socket from '@f/socket';
import {authorize, capitalizeFirst} from '@f/utils';
import './styles.scss';

import Topbar from '@f/containers/Topbar';

class HackerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qr: undefined,
      hacker: undefined,
      error: undefined,
      hasUpdated: true
    };

    this.onBackClick = this.onBackClick.bind(this);
    this.getHacker = this.getHacker.bind(this);
    this.toggleCheckin = this.toggleCheckin.bind(this);
    this.updateHacker = this.updateHacker.bind(this);
    this.constructFields = this.constructFields.bind(this);
  }

  componentDidMount() {
    let qr = this.props.match.params.qr;

    if (!qr) {
      // Show error
    }

    this.setState({qr : qr});
    this.getHacker(qr);
  }

  componentDidUpdate() {
    authorize(this.props.history);
  }

  onBackClick() {
    this.props.history.push('/hackers');
  }

  getHacker(defaultQr) {
    let qr = defaultQr || this.state.qr;
    let token = this.props.store.token || localStorage.getItem('token');

    axios.get(`/api/hackers/${qr}`, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (!res || !res.data || !res.data.hacker) {
        console.error('Could not retrieve hacker');
        this.setState({error: res.data.error || 'Error retrieving hacker', hasUpdated: true});
      }

      this.setState({hacker: res.data.hacker, hasUpdated: true});
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/unauthorized');
      } else {
        this.setState({error: err.response.data.error, hasUpdated: true});
      }
    });
  }

  toggleCheckin() {
    let token = this.props.store.token;
    this.setState({hasUpdated: false});

    axios.post(`/api/hackers/${this.state.qr}/active`, {}, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedInteractions', token);
      socket.emit('updatedHackers', token);

      this.getHacker();
    }).catch(err => {
      authorize(this.props.history);
    });
  }

  updateHacker(name, index) {
    let token = this.props.store.token;
    let updated = {};

    updated.fields = this.constructFields(name, index);

    this.setState({hasUpdated: false});

    axios.post(`/api/hackers/${this.state.qr}`, updated, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedInteractions', token);

      if (name === 'checkin') socket.emit('updatedHackers', token);

      this.getHacker();
    }).catch(err => {
      authorize(this.props.history);
    });
  }

  constructFields(name, index) {
    if (!this.state.hacker || !this.state.hacker.fields) {
      return undefined;
    }

    let fields = JSON.parse(JSON.stringify(this.state.hacker.fields));

    for (let field in fields) {
      if (fields[field].name === name) {
        fields[field].attributes[index].had = !fields[field].attributes[index].had;
      }
    }

    return fields;
  }

  render() {
    let fields = [];

    if (this.state.hacker) {
      for (let field in this.state.hacker.fields) {
        fields.push(
          <div className="hackerField" key={`${this.state.hacker.qr}-${this.state.hacker.fields[field].name}`}>
            <div className="d-flex">
              <h5>{capitalizeFirst(this.state.hacker.fields[field].name)}</h5>
              <h2 className="horizontal-line"></h2>
            </div>
            <div className="list-group">
              {
                this.state.hacker.fields[field].attributes.map((property, index) => (
                  <div className="list-group-item row justify-content-between" key={`${this.state.hacker.qr}-${this.state.hacker.fields[field].name}-${index}`}>
                    <div className="column justify-content-center">
                      <p>{property.name}</p>
                    </div>
                    <div className="column justify-content-center">
                    {
                      property.had
                      ? <button className="btn btn-success" onClick={() => this.updateHacker(this.state.hacker.fields[field].name, index)} disabled={!this.state.hasUpdated}>Complete</button>
                      : <button className="btn btn-danger" onClick={() => this.updateHacker(this.state.hacker.fields[field].name, index)} disabled={!this.state.hasUpdated}>Incomplete</button>
                    }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        );
      }
    }
    else {
      fields = (
        <div id="spinner" className="d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    let checkin = '';
    if (this.state.hacker && this.props.store.config && this.props.store.config.activateOnCheckin) {
      checkin = (
        <div className="list-group">
          <div className="list-group-item row justify-content-between">
            <div className="column justify-content-center">
              <p>Check-in</p>
            </div>
            <div className="column justify-content-center">
            {
              this.state.hacker.active
              ? <button className="btn btn-success" onClick={this.toggleCheckin} disabled={!this.state.hasUpdated}>Arrived</button>
              : <button className="btn btn-danger" onClick={this.toggleCheckin} disabled={!this.state.hasUpdated}>Absent</button>
            }
            </div>
          </div>
        </div>
      );
    }

    let name = '';
    if (!this.state.error && this.state.hacker) {
      name = (
        <div className="nameHeader">
          <h3>{this.state.hacker.name}</h3>
          <p>{this.state.hacker.description}</p>
        </div>
      );
    }

    return (
      <div id="hackerPage" className="tall column">
        <Topbar/>
        <div className="content">
          <div className="row">
            <button className="btn btn-blank" onClick={this.onBackClick}>Back</button>
          </div>
          {name}
          {checkin}
          {this.state.error ? <p>{this.state.error}</p> : fields}
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(HackerPage));

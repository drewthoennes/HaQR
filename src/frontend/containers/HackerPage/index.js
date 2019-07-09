import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {authorize, capitalizeFirst} from '@/utils';
import './styles.scss';

import Topbar from '@/containers/Topbar';

class HackerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qr: undefined,
      hacker: undefined,
      error: undefined
    };

    this.onBackClick = this.onBackClick.bind(this);
    this.getHacker = this.getHacker.bind(this);
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
        this.setState({error: res.data.error || 'Error retrieving hacker'});
      }
      else if (!res.data.hacker.active) {
        this.props.history.push('/hackers');
      }

      this.setState({hacker: res.data.hacker});
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/unauthorized');
      } else {
        this.setState({error: err.response.data.error});
      }
    });
  }

  updateHacker(name, index) {
    let fields = this.constructFields(name, index);

    axios.post(`/api/hackers/${this.state.qr}`, {
      fields: fields
    }, {
      headers: {
        authorization: `token ${this.props.store.token}`
      }
    }).then(res => {
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
                    {
                      property.had
                      ? <button className="btn btn-success" onClick={() => this.updateHacker(this.state.hacker.fields[field].name, index)}>Complete</button>
                      : <button className="btn btn-danger" onClick={() => this.updateHacker(this.state.hacker.fields[field].name, index)}>Incomplete</button>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        );
      }
    }

    let name = '';
    if (!this.state.error && this.state.hacker) {
      name = (
        <h3 className="nameHeader">{this.state.hacker.name}</h3>
      );
    }

    return (
      <div id="hackerPage" className="tall column">
        <Topbar/>
        <div className="content tall">
          <div className="row">
            <button className="btn btn-blank" onClick={this.onBackClick}>Back</button>
          </div>
          {name}
          {this.state.error ? <p>{this.state.error}</p> : fields}
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(HackerPage));

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {capitalizeFirst} from '@/utils';
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

  onBackClick() {
    this.props.history.push('/hackers');
  }

  getHacker(defaultQr) {
    let qr = defaultQr || this.state.qr;

    axios.get(`/api/hackers/${qr}`, {
      headers: {
        Authorization: `token ${this.props.store.token}`
      }
    }).then(res => {
      if (res.data.hacker) {
        this.setState({hacker: res.data.hacker});
      }
      else {
        console.error('Could not retrieve hacker');
        this.setState({error: res.data.error || 'Error retrieving hacker'});
      }
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/unauthorized');
      }
    });
  }

  updateHacker(property, index) {
    let fields = this.constructFields(property, index);

    axios.post(`/api/hackers/${this.state.qr}`, {
      fields: fields
    }, {
      headers: {
        Authorization: `token ${this.props.store.token}`
      }
    }).then(res => {
      this.getHacker();
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push('/unauthorized');
      }
    });
  }

  constructFields(property, index) {
    if (!this.state.hacker || !this.state.hacker.fields) {
      return undefined;
    }

    let fields = JSON.parse(JSON.stringify(this.state.hacker.fields));
    fields[property][index].had = !fields[property][index].had;

    return fields;
  }

  render() {
    let fields = [];

    if (this.state.hacker) {
      for (let field in this.state.hacker.fields) {
        fields.push(
          <div className="hackerField" key={`${this.state.hacker.qr}-${field}`}>
            <div className="d-flex">
              <h5>{capitalizeFirst(field)}</h5>
              <h2 className="horizontal-line"></h2>
            </div>
            <div className="list-group">
              {
                this.state.hacker.fields[field].map((property, index) => (
                  <div className="list-group-item row justify-content-between" key={`${this.state.hacker.qr}-${field}-${index}`}>
                    <div className="column justify-content-center">
                      <p>{property.name}</p>
                    </div>
                    {
                      property.had
                      ? <button className="btn btn-success" onClick={() => this.updateHacker(field, index)}>Complete</button>
                      : <button className="btn btn-danger" onClick={() => this.updateHacker(field, index)}>Incomplete</button>
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

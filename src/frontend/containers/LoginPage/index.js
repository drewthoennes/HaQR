import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import {parseQuery} from '@/utils';
import axios from 'axios';
import './styles.scss';

class LoginPage extends React.Component {
  constructor() {
    super();

    this.state = {
    };

    this.authenticate = this.authenticate.bind(this);
  }

  componentDidMount() {
    console.log(this.getToken());
  }

  getToken() {
    let query = parseQuery(window.location.search);
    if (!query) {
      return;
    }

    return query.find(q => {
      return q.indexOf('token=') != -1;
    });
  }

  authenticate() {
    axios.get('/api/auth/github?return=true').then(res => {
      window.location.href = res.data.url;
    }).catch(err => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.authenticate}>Login with Github</button>
      </div>
    );
  }
};

export default connect(map)(LoginPage);

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import {parseQuery} from '@/utils';
import axios from 'axios';
import store from '@/store';
import {setToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import './styles.scss';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.authenticate = this.authenticate.bind(this);
  }

  componentDidMount() {
    let token = this.getToken();

    if (token) {
      localStorage.setItem('token', token);
      store.dispatch(setToken(token));
      this.props.history.push('/hackers');
    }
  }

  getToken() {
    let query = parseQuery(window.location.search);
    if (!query) {
      return;
    }

    let pair = query.find(q => {
      return q.indexOf('token=') != -1;
    });

    return pair.substr(pair.indexOf('=') + 1);
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

export default connect(map)(withRouter(LoginPage));

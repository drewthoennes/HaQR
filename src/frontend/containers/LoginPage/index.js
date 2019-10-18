import React from 'react';
import {connect} from 'react-redux';
import map from '@f/store/map';
import {parseQuery} from '@f/utils';
import axios from 'axios';
import store from '@f/store';
import {setToken} from '@f/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import c from '@f/const';
import './styles.scss';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.checkForExistingToken = this.checkForExistingToken.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  componentDidMount() {
    // Check if we have a token in local storage or in the store
    this.checkForExistingToken();

    let token = this.getToken();

    if (token) {
      localStorage.setItem('token', token);
      store.dispatch(setToken(token));
      this.props.history.push('/hackers');
    }
  }

  checkForExistingToken() {
    if (this.props.store.token || localStorage.getItem('token')) {
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
      <div id="loginPage" className="tall">
        <div className="content tall column column-center">
          <div id="loginPanel" className="column column-around">
            <div>
              <h1>Login</h1>
              <h4>{c.name}</h4>
            </div>
            <p>Login with your GitHub account to get started.</p>
            <button className="row row-around" onClick={this.authenticate} aria-label="Login">
              <FontAwesomeIcon icon={faGithub}/>
              <p>Login with Github</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(LoginPage));

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import store from '@/store';
import {removeToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class UnauthorizedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    return (
      <div id="unauthorizedPage" className="tall">
        <div className="topbar">
          <button class="btn btn-blank" onClick={this.logout}>Logout</button>
        </div>

        <div className="content tall column justify-content-center">
          <h4>You don't have access to access this service</h4>
          <p>Please contact the BoilerMake team if you should have access.</p>
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(UnauthorizedPage));

import React from 'react';
import {connect} from 'react-redux';
import map from '@f/store/map';
import store from '@f/store';
import {removeToken} from '@f/store/actions';
import {withRouter} from 'react-router-dom';
import {authorize} from '@f/utils';
import './styles.scss';

import Topbar from '@f/containers/Topbar';

class UnauthorizedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.logout = this.logout.bind(this);
  }

  componentDidUpdate() {
    if (authorize(this.props.history)) {
      this.props.history.push('/hackers');
    }
  }

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    return (
      <div id="unauthorizedPage" className="tall">
        <Topbar noButtons/>
        <div className="content column justify-content-center">
          <h4>You don't have permission to access this service</h4>
          <p>Verify that your name is set on GitHub.</p>
          <p>Please contact the BoilerMake team if you should have access.</p>
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(UnauthorizedPage));

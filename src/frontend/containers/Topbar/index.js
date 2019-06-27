import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import store from '@/store';
import {removeToken} from '@/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class Topbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
  }

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    return (
      <div id="topbar" className="row justify-content-end">
          <div className="topbar-item column justify-content-center" onClick={this.logout}>
              <FontAwesomeIcon icon={faSignOutAlt}/>
          </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(Topbar));

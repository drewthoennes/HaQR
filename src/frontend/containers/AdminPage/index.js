import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

import Topbar from '@/containers/Topbar';
import HackersView from './_hackersView';
import UsersView from './_usersView';
import MetricsView from './_metricsView';
import ChangelogView from './_changelogView';
import SettingsView from './_settingsView';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'hackers'
    };

    this.checkIfAuthorized = this.checkIfAuthorized.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  componentDidMount() {
    this.checkIfAuthorized();
  }

  componentDidUpdate() {
    this.checkIfAuthorized();
  }

  checkIfAuthorized() {
    // Redirect if unauthorized
    if (this.props.store.account.role && this.props.store.account.role !== 'admin') {
      this.props.history.push('/hackers');
    }
  }
  
  changeView(view) {
    if (view !== this.state.view) {
      this.setState({view});
    }
  }

  render() {
    let view;
    switch(this.state.view) {
      case 'hackers':
        view = (<HackersView hackers={this.props.store.hackers} token={this.props.store.token}/>);
        break;
      case 'users':
          view = (<UsersView users={this.props.store.users} token={this.props.store.token}/>);
          break;
      case 'metrics':
          view = (<MetricsView/>);
          break;
      case 'changelog':
          view = (<ChangelogView/>);
          break;
      case 'settings':
          view = (<SettingsView/>);
          break;
    }

    return (
      <div id="adminPage" className="column">
        <Topbar/>

        <div className="content">
          <div id="sidebar" className="justify-content-start">
            <div className="list-group">
              <button className="list-group-item" onClick={() => this.changeView('hackers')}>Hackers</button>
              <button className="list-group-item" onClick={() => this.changeView('users')}>Users</button>
              <button className="list-group-item" onClick={() => this.changeView('metrics')}>Metrics</button>
              <button className="list-group-item" onClick={() => this.changeView('changelog')}>Changelog</button>
              <button className="list-group-item" onClick={() => this.changeView('settings')}>Settings</button>
            </div>
          </div>

          <div className="view">
            {view}
          </div>
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(AdminPage));

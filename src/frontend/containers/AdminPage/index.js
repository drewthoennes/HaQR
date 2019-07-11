import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import {authorize, browserIsChrome} from '@/utils';
import './styles.scss';

import Topbar from '@/containers/Topbar';
import HackersView from './_hackersView';
import AddHackersView from './_addHackersView';
import UsersView from './_usersView';
import MetricsView from './_metricsView';
import ChangelogView from './_changelogView';
import SettingsView from './_settingsView';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'hackers',
      isBlurred: false
    };

    this.checkIfAuthorized = this.checkIfAuthorized.bind(this);
    this.changeView = this.changeView.bind(this);
    this.blur = this.blur.bind(this);
    this.unblur = this.unblur.bind(this);
  }

  componentDidMount() {
    this.checkIfAuthorized();
  }

  componentDidUpdate() {
    authorize(this.props.history);
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

  blur() {
    this.setState({isBlurred: true});
  }

  unblur() {
    this.setState({isBlurred: false});
  }

  render() {
    let view;
    switch(this.state.view) {
      case 'hackers':
        view = (<HackersView hackers={this.props.store.hackers} token={this.props.store.token}/>);
        break;
      case 'addHackers':
        view = (<AddHackersView token={this.props.store.token} isBlurred={this.state.isBlurred} blur={this.blur} unblur={this.unblur}/>);
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
          view = (<SettingsView token={this.props.store.token} config={this.props.store.config}/>);
          break;
    }

    return (
      <div id="adminPage" className={`column${this.state.isBlurred ? ' blur' : ''}`} style={{minHeight: browserIsChrome() ? '100%' : ''}}>
        <Topbar admin/>

        <div className="content tall">
          <div id="sidebar" className="justify-content-start">
            <div className="list-group">
              <button className={`list-group-item${this.state.view === 'hackers' ? ' selected' : ''}`} onClick={() => this.changeView('hackers')}>Hackers</button>
              <button className={`list-group-item${this.state.view === 'addHackers' ? ' selected' : ''}`} onClick={() => this.changeView('addHackers')}>Add Hackers</button>
              <button className={`list-group-item${this.state.view === 'users' ? ' selected' : ''}`} onClick={() => this.changeView('users')}>Users</button>
              <button className={`list-group-item${this.state.view === 'metrics' ? ' selected' : ''}`} onClick={() => this.changeView('metrics')}>Metrics</button>
              <button className={`list-group-item${this.state.view === 'changelog' ? ' selected' : ''}`} onClick={() => this.changeView('changelog')}>Changelog</button>
              <button className={`list-group-item${this.state.view === 'settings' ? ' selected' : ''}`} onClick={() => this.changeView('settings')}>Settings</button>
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

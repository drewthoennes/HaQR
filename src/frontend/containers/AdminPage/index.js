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
import SettingsView from './_settingsView';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'hackers'
    };

    this.changeView = this.changeView.bind(this);
  }

  componentDidMount() {
  }

  changeView(view) {
    if (view !== this.state.view) {
      this.setState({view});
    }
  }

  render() {
    console.log(this.props.store);

    let view;
    switch(this.state.view) {
      case 'hackers':
        view = (<HackersView hackers={this.props.store.hackers}/>);
        break;
      case 'users':
          view = (<UsersView users={this.props.store.users}/>);
          break;
      case 'metrics':
          view = (<MetricsView/>);
          break;
      case 'settings':
          view = (<SettingsView/>);
          break;
    }

    return (
      <div id="adminPage" className="tall column">
        <Topbar/>

        <div className="content tall row">
          <div id="sidebar" className="tall column justify-content-start">
            <div className="list-group">
              <button className="list-group-item" onClick={() => this.changeView('hackers')}>Hackers</button>
              <button className="list-group-item" onClick={() => this.changeView('users')}>Users</button>
              <button className="list-group-item" onClick={() => this.changeView('metrics')}>Metrics</button>
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

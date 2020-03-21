import React from 'react';
import {connect} from 'react-redux';
import map from '@f/store/map';
import store from '@f/store';
import {removeToken} from '@f/store/actions';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faHome, faTools, faUser, faUserCircle, faClipboardList} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class Topbar extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      showAccountDropdown: false
    };

    this.showAccountDropdown = this.showAccountDropdown.bind(this);
    this.closeAccountDropdown = this.closeAccountDropdown.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  showAccountDropdown() {
    if (!this._isMounted) return;

    this.setState({showAccountDropdown: true}, () => {
      document.addEventListener('click', this.closeAccountDropdown);
    });
  }

  closeAccountDropdown() {
    if (!this._isMounted) return;

    this.setState({showAccountDropdown: false}, () => {
      document.removeEventListener('click', this.closeAccountDropdown);
    });
  }

  logout() {
    localStorage.removeItem('token');
    store.dispatch(removeToken());
    this.props.history.push('/login');
  }

  render() {
    let adminButton = '';
    if (!this.props.noButtons && this.props.store.account && (this.props.store.account.role === 'admin' || this.props.store.account.role === 'owner')) {
      adminButton = (
        <div className={`topbar-item column justify-content-center${this.props.admin ? ' selected' : ''}`} onClick={() => this.props.history.push('/admin')}>
          <FontAwesomeIcon icon={faTools}/>
        </div>
      );
    }

    let homeButton = '';
    let interactionsButton = '';
    if (!this.props.noButtons) {
      homeButton = (
        <div className={`topbar-item column justify-content-center${this.props.home ? ' selected' : ''}`} onClick={() => this.props.history.push('/hackers')}>
            <FontAwesomeIcon icon={faHome}/>
        </div>
      );

      interactionsButton = (
        <div className={`topbar-item column justify-content-center${this.props.interactions ? ' selected' : ''}`} onClick={() => this.props.history.push('/interactions')}>
          <FontAwesomeIcon icon={faClipboardList}/>
        </div>
      );
    }

    let accountDropdown = '';
    if (this.props.store.account && this.state.showAccountDropdown) {
      accountDropdown = (
        <div className="dropdown">
          <div id="grey-arrow-up"></div>
          <div id="white-arrow-up"></div>
          <ul>
            <div id="account-row" className="row">
              <div className="column justify-content-center">
                <FontAwesomeIcon icon={faUserCircle}/>
              </div>
              <div className="column justify-content-between">
                <li>{this.props.store.account.name}</li>
                <li>{this.props.store.account.email}</li>
              </div>
            </div>
            <div id="buttons-row">
              <div className="row">
                <li className="row" onClick={this.logout}>
                  <div className="column justify-content-center row-icon">
                    <FontAwesomeIcon icon={faSignOutAlt}/>
                  </div>
                  <div className="column justify-content-center">
                    <p>Log out</p>
                  </div>
                </li>
              </div>
            </div>
          </ul>
        </div>
      );
    }

    return (
      <div id="topbar" className="row justify-content-end">
        {adminButton}
        {interactionsButton}
        {homeButton}
        <div className="topbar-item column justify-content-center" onClick={this.showAccountDropdown}>
            <FontAwesomeIcon icon={faUser}/>
            {accountDropdown}
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(Topbar));

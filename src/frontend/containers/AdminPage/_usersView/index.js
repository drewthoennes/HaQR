import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class _usersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
  }

  render() {
    let users = this.props.users.map(user => (
      <div className="list-group-item row" key={user.email}>
        <p>{user.name}</p>
      </div>
    ));

    return (
      <div id="_usersView" className="tall">
        <div className="list-group">
          {users}
        </div>
      </div>
    );
  }
};

export default _usersView;

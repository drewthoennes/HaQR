import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import {sortByProperty} from '@/utils';
import socket from '@/socket';
import './styles.scss';

class _usersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sort: '',
      asc: false
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.toggleAuthorized = this.toggleAuthorized.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
  }

  componentDidMount() {
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  sortBy(sort) {
    if (sort === this.state.sort) {
      this.setState({asc: !this.state.asc});
      return;
    }

    this.setState({sort: sort, asc: true});
  }

  toggleAuthorized(id) {
    let token = this.props.token;

    axios.post(`/api/users/${id}/authorize`, {}, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedUsers', token);
    }).catch(err => {
    });
  }  

  toggleAdmin(id) {
    let token = this.props.token;

    axios.post(`/api/users/${id}/role`, {}, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedUsers', token);
    }).catch(err => {
    });
  }

  render() {
    let search = this.state.search.toLowerCase();
    let admins = this.props.users.filter(user => {
      return user.role === 'admin';
    });

    let users = this.props.users.filter(user => {
      return user.name.toLowerCase().includes(search);
    });
    
    users.sort(sortByProperty(this.state.sort));

    if (!this.state.asc) {
      users.reverse();
    }

    users = users.map(user => (
      <tr key={user._id}>
        <td scope="row">{user.name}</td>
        <td scope="row">{user.email}</td>
        <td className="row justify-content-around">
          <button id="authorize-button" className={`btn ${user.authorized ? 'btn-success' : 'btn-danger'}`} onClick={() => this.toggleAuthorized(user._id)}>{user.authorized ? 'Authorized' : 'Unauthorized'}</button>
          <button id="admin-button" className={`btn ${user.role === 'admin' ? 'btn-success' : 'btn-blank'}`} disabled={user.role === 'admin' && admins.length === 1} onClick={() => this.toggleAdmin(user._id)}>{user.role === 'admin' ? 'Admin' : 'Member'}</button>
        </td>
      </tr>
    ));

    return (
      <div id="_usersView" className="tall">
        <div id="searchbar" className="row">
          <input className="form-control" type="text" value={this.state.search} onChange={this.onSearchChange} placeholder="Search"/>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" onClick={() => this.sortBy('name')}>Name</th>
              <th scope="col" onClick={() => this.sortBy('email')}>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users}
          </tbody>
        </table>
      </div>
    );
  }
};

export default _usersView;

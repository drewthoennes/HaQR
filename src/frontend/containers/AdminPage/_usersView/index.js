import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {sortByProperty} from '@f/utils';
import socket from '@f/socket';
import './styles.scss';

import GenericTable from '@f/components/GenericTable';

const columns = [
  {name: 'Name', value: 'name'},
  {name: 'Email', value: 'email'},
  {name: '', value: ''}
];

class _usersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sort: '',
      asc: false
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.transferOwnership = this.transferOwnership.bind(this);
    this.toggleAuthorized = this.toggleAuthorized.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
  }

  componentDidMount() {
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  onSortChange(sort, asc) {
    this.setState({sort: sort, asc: asc});
  }

  sortBy(sort) {
    if (sort === this.state.sort) {
      this.setState({asc: !this.state.asc});
      return;
    }

    this.setState({sort: sort, asc: true});
  }

  transferOwnership(id) {
    let token = this.props.token;

    axios.post(`/api/users/${id}/ownership`, {}, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedUsers', token);
    }).catch(err => {
    });
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
      return user && user.name && user.name.toLowerCase().includes(search);
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
          {this.props.account.role === 'owner' && user.role !== 'owner' ?
            <button id="ownership-button" className="btn btn-blank" onClick={() => this.transferOwnership(user._id)}>Transfer Ownership</button> :
           this.props.account.role === 'owner' && user.role === 'owner' ?
            <button id="ownership-button" className="btn btn-blank" style={{'visibility': 'hidden'}}>Hi there :)</button>
           : ''
          }
          <button id="authorize-button" className={`btn ${user.authorized ? 'btn-success' : 'btn-danger'}`} disabled={user.role === 'owner'} onClick={() => this.toggleAuthorized(user._id)}>{user.authorized ? 'Authorized' : 'Unauthorized'}</button>
          <button id="admin-button" className={`btn ${user.role === 'owner' || user.role === 'admin' ? 'btn-success' : 'btn-blank'}`} disabled={user.role === 'owner'} onClick={() => this.toggleAdmin(user._id)}>{user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Member'}</button>
        </td>
      </tr>
    ));

    return (
      <div id="_usersView" className="tall">
        <div id="searchbar" className="row">
          <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search"/>
        </div>

        <GenericTable className={this.props.account.role === 'owner' ? 'owner' : ''} columns={columns} rows={users} onSortChange={this.onSortChange}/>
      </div>
    );
  }
};

export default withRouter(_usersView);

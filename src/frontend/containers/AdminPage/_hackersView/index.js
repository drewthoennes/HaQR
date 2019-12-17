import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {sortByProperty} from '@f/utils';
import socket from '@f/socket';
import './styles.scss';

import GenericTable from '@f/components/GenericTable';

const columns = [
  {name: 'QR', value: 'qr'},
  {name: 'Name', value: 'name'},
  {name: 'Email', value: 'email'},
  {name: 'Role', value: 'role'},
  {name: '', value: ''},
];

class _hackersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sort: '',
      asc: false
    };

    this.table = React.createRef();

    this.onSearchChange = this.onSearchChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
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

  toggleActive(qr) {
    let token = this.props.token;

    axios.post(`/api/hackers/${qr}/active`, {}, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      socket.emit('updatedHackers', token);
    }).catch(err => {
    });
  }

  onSortChange(sort, asc) {
    this.setState({sort: sort, asc: asc});
  }

  render() {
    let search = this.state.search.toLowerCase();

    let hackers = this.props.hackers;

    // Populate role
    if (this.props.roles && this.props.roles.length > 0) {
      hackers = hackers.map(hacker => {
        let role = this.props.roles.find(role => {
          return role._id == hacker.role;
        });

        return Object.assign({}, hacker, {role: role.name});
      });
    }

    // Filter by search
    hackers = hackers.filter(hacker => {
      let qr = String(hacker.qr).includes(search);
      let name = hacker.name.toLowerCase().includes(search);
      let email = hacker.email.toLowerCase().includes(search);
      let role = hacker.role.toLowerCase().includes(search);

      return qr || name || email || role;
    });

    // Sort by column
    hackers.sort(sortByProperty(this.state.sort));
    if (!this.state.asc) {
      hackers.reverse();
    }

    hackers = hackers.map(hacker => (
      <tr key={hacker.qr}>
        <td scope="row">{hacker.qr}</td>
        <td scope="row">{hacker.name}</td>
        <td scope="row">{hacker.email}</td>
        <td scope="row">{hacker.role}</td>
        <td className="row justify-content-around">
          <button id="active-button" className={`btn ${hacker.active ? 'btn-success' : 'btn-danger'}`} onClick={() => this.toggleActive(hacker.qr)}>{hacker.active ? 'Active' : 'Inactive'}</button>
        </td>
      </tr>
    ));

    return (
      <div id="_hackersView" className="tall">
        <div id="searchbar" className="row">
          <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search"/>
        </div>

        <GenericTable ref={this.table} columns={columns} rows={hackers} onSortChange={this.onSortChange}/>
      </div>
    );
  }
};

export default withRouter(_hackersView);

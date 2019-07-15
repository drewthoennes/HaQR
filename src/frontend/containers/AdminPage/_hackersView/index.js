import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import {sortByProperty} from '@/utils';
import socket from '@/socket';
import './styles.scss';

class _hackersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sort: '',
      asc: false
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
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

  render() {
    let search = this.state.search.toLowerCase();

    let hackers = this.props.hackers.filter(hacker => {
      return hacker.name.toLowerCase().includes(search);
    });
    
    hackers.sort(sortByProperty(this.state.sort));

    if (!this.state.asc) {
      hackers.reverse();
    }

    hackers = hackers.map(hacker => (
      <tr key={hacker.qr}>
        <td scope="row">{hacker.qr}</td>
        <td scope="row">{hacker.name}</td>
        <td scope="row">{hacker.email}</td>
        <td className="row justify-content-around">
          <button className={`btn ${hacker.active ? 'btn-success' : 'btn-danger'}`} onClick={() => this.toggleActive(hacker.qr)}>{hacker.active ? 'Active' : 'Inactive'}</button>
        </td>
      </tr>
    ));

    return (
      <div id="_hackersView" className="tall">
        <div id="searchbar" className="row">
          <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search"/>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" onClick={() => this.sortBy('qr')}>QR</th>
              <th scope="col" onClick={() => this.sortBy('name')}>Name</th>
              <th scope="col" onClick={() => this.sortBy('email')}>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hackers}
          </tbody>
        </table>
      </div>
    );
  }
};

export default withRouter(_hackersView);

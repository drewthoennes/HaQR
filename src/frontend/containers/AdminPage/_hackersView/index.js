import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faChevronUp, faChevronDown, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {sortByProperty} from '@f/utils';
import socket from '@f/socket';
import './styles.scss';

class _hackersView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      sort: '',
      asc: false,
      page: 1,
      pagesShown: 3,
      rowsPerPage: 10
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.filterRowsOnPage = this.filterRowsOnPage.bind(this);
    this.changePage = this.changePage.bind(this);
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

  filterRowsOnPage(rows) {
    let start = (this.state.page - 1) * this.state.rowsPerPage;
    let end =  this.state.page * this.state.rowsPerPage;

    return rows.slice(start, end);
  }

  changePage(page) {
    this.setState({page: page});
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
          <button className={`btn ${hacker.active ? 'btn-success' : 'btn-danger'}`} onClick={() => this.toggleActive(hacker.qr)}>{hacker.active ? 'Active' : 'Inactive'}</button>
        </td>
      </tr>
    ));

    let paginationButtons = [];
    let pages = Math.ceil(hackers.length / this.state.rowsPerPage);
    // let firstButtonDisabled = hackers.length == 0 || this.state.page === 1;
    let previousButtonDisabled = hackers.length == 0 || this.state.page === 1;
    let nextButtonDisabled = hackers.length == 0 || this.state.page === pages;
    // let lastButtonDisabled = hackers.length == 0 || this.state.page === pages;
    let halfButtons = Math.floor(this.state.pagesShown / 2);

    // Verify current page is valid
    if (pages > 0 && this.state.page > pages) {
      this.changePage(1);
    }

    // Add first button
    /*
    paginationButtons.push(
      <button
        key="pagination-first"
        className={firstButtonDisabled ? 'btn btn-blank btn-left disabled' : 'btn btn-blank btn-left'}
        disabled={firstButtonDisabled}
        onClick={() => this.changePage(1)}>
        <div className="row">
          <div className="column"><FontAwesomeIcon icon={faChevronLeft}/></div>
          <div className="column"><FontAwesomeIcon icon={faChevronLeft}/></div>
        </div>
      </button>
    );
    */

    // Add previous button
    paginationButtons.push(
      <button
        key="pagination-previous"
        className={`btn btn-blank btn-left${previousButtonDisabled ? ' disabled' : ''}`}
        disabled={previousButtonDisabled}
        onClick={() => this.changePage(this.state.page - 1)}>
        <div className="row">
          <div className="column">
            <FontAwesomeIcon icon={faChevronLeft}/>
          </div>
        </div>
      </button>
    );

    let start;
    let end;

    if (this.state.page <= halfButtons) { // Check for first halfButtons number of buttons
      start = 1;
    }
    else if (pages - this.state.page <= halfButtons && this.state.page != 1) { // Check for last halfButtons number of buttons
      start = pages - this.state.pagesShown + 1;

      // Handle case where there are less pages than pagesShown
      if (pages < this.state.pagesShown) start += this.state.pagesShown - pages;
    }
    else if (this.state.page > 1) {
      start = this.state.page - halfButtons;
    }
    end = start + this.state.pagesShown;

    if (hackers.length > 0) {
      paginationButtons = paginationButtons.concat(
        new Array(Math.min(pages, this.state.pagesShown)).fill(0).map((_, index) => {
          return (
            <button key={`pagination-button-${start + index}`} className={this.state.page === start + index ? 'btn btn-blank page disabled' : 'btn btn-blank page'} value={start + index} onClick={() => this.changePage(start + index)} disabled={this.state.page === start + index}>{start + index}</button>
          );
        })
      );
    }

    // Add next button
    paginationButtons.push(
      <button
        key="pagination-next"
        className={`btn btn-blank btn-right${nextButtonDisabled ? ' disabled' : ''}`}
        disabled={nextButtonDisabled}
        onClick={() => this.changePage(this.state.page + 1)}>
        <div className="row">
          <div className="column">
            <FontAwesomeIcon icon={faChevronRight}/>
          </div>
        </div>
      </button>
    );

    // Add last button
    /*
    paginationButtons.push(
      <button
        key="pagination-last"
        className={lastButtonDisabled ? 'btn btn-blank btn-right disabled' : 'btn btn-blank btn-right'}
        disabled={lastButtonDisabled}
        onClick={() => this.changePage(pages)}>
        <div className="row">
          <div className="column"><FontAwesomeIcon icon={faChevronRight}/></div>
          <div className="column"><FontAwesomeIcon icon={faChevronRight}/></div>
        </div>
      </button>
    );
    */

    let paginationDescriptor;
    if (hackers.length > 0) {
      paginationDescriptor = (
        <div id="pagination-descriptor" className="column column-center">
          <p>{`Showing ${(this.state.page - 1) * this.state.rowsPerPage + 1} - ${Math.min(hackers.length, this.state.page * this.state.rowsPerPage)} of ${hackers.length}`}</p>
        </div>
      );
    }

    // Limit rows to rowsPerPage
    if (hackers.length > 0) {
      hackers = this.filterRowsOnPage(hackers);
    }

    return (
      <div id="_hackersView" className="tall">
        <div id="searchbar" className="row">
          <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search"/>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" onClick={() => this.sortBy('qr')}>
                <div className="row">
                  <p>QR</p>
                  <div className="column justify-content-center">
                    <FontAwesomeIcon icon={this.state.sort === 'qr' ? this.state.asc ? faChevronUp : faChevronDown : faMinus}/>
                  </div>
                </div>
              </th>
              <th scope="col" onClick={() => this.sortBy('name')}>
                <div className="row">
                  <p>Name</p>
                  <div className="column justify-content-center">
                    <FontAwesomeIcon icon={this.state.sort === 'name' ? this.state.asc ? faChevronUp : faChevronDown : faMinus}/>
                  </div>
                </div>
              </th>
              <th scope="col" onClick={() => this.sortBy('email')}>
                <div className="row">
                  <p>Email</p>
                  <div className="column justify-content-center">
                    <FontAwesomeIcon icon={this.state.sort === 'email' ? this.state.asc ? faChevronUp : faChevronDown : faMinus}/>
                  </div>
                </div>
              </th>
              <th scope="col" onClick={() => this.sortBy('role')}>
                <div className="row">
                  <p>Role</p>
                  <div className="column justify-content-center">
                    <FontAwesomeIcon icon={this.state.sort === 'role' ? this.state.asc ? faChevronUp : faChevronDown : faMinus}/>
                  </div>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hackers}
          </tbody>
        </table>
        <div className="row row-end">
            {paginationDescriptor}
            <div id="pagination-buttons">{paginationButtons}</div>
          </div>
      </div>
    );
  }
};

export default withRouter(_hackersView);

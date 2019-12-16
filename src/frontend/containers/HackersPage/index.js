import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import map from '@f/store/map';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import socket from '@f/socket';
import {authorize, sortByProperty} from '@f/utils';
import './styles.scss';

import Topbar from '@f/containers/Topbar';
import QRReader from '@f/components/QRReader';
import ScanModal from '@f/components/ScanModal';

class HackersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      scan: {
        name: '',
        attribute: ''
      },
      loaded: false,
      showScanner: false,
      unauthorized: false,
      page: 1,
      pagesShown: 3,
      rowsPerPage: 10
    };

    this.scanModal = React.createRef();

    this.onSearchChange = this.onSearchChange.bind(this);
    this.showScanner = this.showScanner.bind(this);
    this.hideScanner = this.hideScanner.bind(this);
    this.onQRScan = this.onQRScan.bind(this);
    this.openHackerPage = this.openHackerPage.bind(this);
    this.onSearchForChange = this.onSearchForChange.bind(this);
    this.onSearchForCheckin = this.onSearchForCheckin.bind(this);
    this.filterRowsOnPage = this.filterRowsOnPage.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidUpdate() {
    authorize(this.props.history);
  }

  onSearchChange(event) {
    this.setState({search: event.target.value});
  }

  showScanner() {
    this.setState({showScanner: true}, () => {
      document.addEventListener('click', this.hideScanner);
    });
  }

  hideScanner() {
    this.setState({showScanner: false}, () => {
      document.removeEventListener('click', this.hideScanner);
    });
  }

  onQRScan(qr) {
    if (this.state.scan !== 'checkin' && !this.state.scan.name) {
      this.props.history.push(`/hackers/${qr}`);
      return;
    }

    // Attempt to scan for a particular field
    let token = this.props.store.token;
    this.hideScanner();
    this.scanModal.current.openModal();

    let endpoint = `/api/hackers/${qr}/${this.state.scan === 'checkin' ? 'checkin' : 'toggle'}`;

    axios.post(endpoint, this.state.scan, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (res && res.data && res.data.message) {
        if (this.state.scan === 'checkin') {
          this.scanModal.current.onSuccess(`Checked in hacker`);
          socket.emit('updatedHackers', token);
        }
        else {
          this.scanModal.current.onSuccess(`Updated field ${this.state.scan.attribute}`);
        }

        return;
      }

      this.scanModal.current.onError(res.data.error || 'There was an error toggling this field');
    });
  }

  onQRError(error) {
    console.error(error);
  }

  openHackerPage(qr) {
    if (!this.state.showScanner) {
      this.props.history.push(`/hackers/${qr}`);
    }
  }

  onSearchForChange(event) {
    if (event.target.value === 'checkin') {
      this.setState({scan: event.target.value});
    }
    else {
      this.setState({scan: JSON.parse(event.target.value)});
    }
  }

  onSearchForCheckin() {
    this.setState({scan: 'checkin'});
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
    let checkin = '';

    if (this.props.store.hackers.find(hacker => {
      return hacker && hacker.checkin && hacker.checkin.enabled;
    })) {
      checkin = (<option onClick={this.onSearchForCheckin} value="checkin">Check-in</option>);
    }

    let roles = this.props.store.roles.filter(role => {
      return this.props.store.hackers.find(hacker => {
        return hacker.role == role._id;
      });
    }).map(role => {
      return role.fields.map(field => {
        let options = [];

        options.push(<option key={field.name} disabled>{field.name}</option>);
        options = options.concat(
          field.attributes.map(attribute => (
            <option key={`${field.name}-${attribute}`} value={JSON.stringify({name: field.name, attribute: attribute})}>{attribute}</option>
          ))
        );

        return options;
      });
    });

    let search = this.state.search.toLowerCase();
    let hackers = this.props.store.hackers.filter(hacker => {
      return hacker.active;
    }).filter(hacker => {
      let matchName = hacker ? hacker.name.toLowerCase().includes(search) : false;
      let matchEmail = hacker ? hacker.email.toLowerCase().includes(search) : false

      return hacker ? matchName || matchEmail : false;
    }).sort(sortByProperty('name')).map(hacker => (
      <button className="list-group-item" key={hacker.qr} onClick={() => this.openHackerPage(hacker.qr)}>{hacker.name} ({hacker.email})</button>
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

    if (hackers.length === 0) {
      hackers = (
        <div className="card row">
          <div className="card-body">
            <h5 className="card-title row row-between">No active hackers</h5>
            <p>Add or activate some hackers to get started</p>
          </div>
        </div>
      );
    }

    // Limit rows to rowsPerPage
    if (hackers.length > 0) {
      hackers = this.filterRowsOnPage(hackers);
    }

    let scanner = '';
    if (this.state.showScanner) {
      scanner = (<QRReader onScan={this.onQRScan} onError={this.onQRError}/>);
    }

    return (
      <div id="hackersPage" className={`content ${this.state.showScanner ? ' blur' : ''}`}>
        <Topbar home/>
        <div className="content">
          <div id="pageBar">
            <input className="form-control" type="text" value={this.state.search} aria-label="search" onChange={this.onSearchChange} placeholder="Search..."/>

            <div className="row">
              <button id="scanQRButton" className="btn btn-blank" onClick={this.showScanner} aria-label="Scan qr code">
                <div className="column row-center">
                  <div className="row row-center">
                    <FontAwesomeIcon icon={faCamera}/>
                    </div>
                </div>
              </button>

              <select id="filterSelector" className="form-control" onChange={this.onSearchForChange}>
                <option className="dropdown-item" value={JSON.stringify({name: '', attribute: ''})}>None</option>
                {checkin}
                {roles}
              </select>

            </div>
          </div>

          <div className="list-group">
            {hackers}
          </div>

          <div className="row row-end">
            {paginationDescriptor}
            <div id="pagination-buttons">{paginationButtons}</div>
          </div>
        </div>

        {scanner}
        <ScanModal ref={this.scanModal}/>
      </div>
    );
  }
};

export default connect(map)(withRouter(HackersPage));

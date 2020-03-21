import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

import SortableColumn from './SortableColumn';

class GenericTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: '',
      asc: false,
      page: 1
    };

    this.sortBy = this.sortBy.bind(this);
    this.filterRowsOnPage = this.filterRowsOnPage.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.props.onSortChange(this.state.sort, this.state.asc);
  }

  sortBy(sort) {
    if (sort === this.state.sort) {
      this.props.onSortChange(sort, !this.state.asc);
      this.setState({asc: !this.state.asc});
      return;
    }

    this.props.onSortChange(sort, true);
    this.setState({sort: sort, asc: true});
  }

  filterRowsOnPage(rows) {
    let start = (this.state.page - 1) * this.props.rowsPerPage;
    let end =  this.state.page * this.props.rowsPerPage;

    return rows.slice(start, end);
  }

  changePage(page) {
    this.setState({page: page});
  }

  render () {
    // Header columns on table
    let columns = this.props.columns.map(column => {
      if (!column.name || column.name === '') {
        return (<th key={column.name}></th>);
      }
      else if (!column.value || column.value === '') {
        return (<th key={column.name} scope="col"><div className="row"><p>Fields</p></div></th>);
      }
      else {
        return (<SortableColumn key={column.name} name={column.name} value={column.value} current={this.state.sort} asc={this.state.asc} sort={() => this.sortBy(column.value)}/>);
      }
    });

    let rows = this.props.rows;

    let paginationButtons = [];
    let pages = Math.ceil(rows.length / this.props.rowsPerPage);
    let previousButtonDisabled = rows.length == 0 || this.state.page === 1;
    let nextButtonDisabled = rows.length == 0 || this.state.page === pages;
    let halfButtons = Math.floor(this.props.pagesShown / 2);

    // Verify current page is valid
    if (pages > 0 && this.state.page > pages) {
      this.changePage(1);
    }

    // Add previous button
    paginationButtons.push(
      <button
        key="pagination-previous"
        className={`btn btn-blank btn-left${previousButtonDisabled ? ' disabled' : ''}`}
        disabled={previousButtonDisabled}
        onClick={() => this.changePage(this.state.page - 1)}>
        <div className="row"><div className="column"><FontAwesomeIcon icon={faChevronLeft}/></div></div>
      </button>
    );

    let start;

    if (this.state.page <= halfButtons) { // Check for first halfButtons number of buttons
      start = 1;
    }
    else if (pages - this.state.page <= halfButtons && this.state.page != 1) { // Check for last halfButtons number of buttons
      start = pages - this.props.pagesShown + 1;

      // Handle case where there are less pages than pagesShown
      if (pages < this.props.pagesShown) start += this.props.pagesShown - pages;
    }
    else if (this.state.page > 1) {
      start = this.state.page - halfButtons;
    }

    if (rows.length > 0) {
      paginationButtons = paginationButtons.concat(
        new Array(Math.min(pages, this.props.pagesShown)).fill(0).map((_, index) => {
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

    let paginationDescriptor;
    if (rows.length > 0) {
      paginationDescriptor = (
        <div id="pagination-descriptor" className="column column-center">
          <p>{`Showing ${(this.state.page - 1) * this.props.rowsPerPage + 1} - ${Math.min(rows.length, this.state.page * this.props.rowsPerPage)} of ${rows.length}`}</p>
        </div>
      );
    }

    // Limit rows to rowsPerPage
    if (rows.length > 0) {
        rows = this.filterRowsOnPage(rows);
    }

    return (
      <>
        <table id="generic-table" className={`table table-striped${this.props.className ? ' ' + this.props.className : ''}`}>
          <thead><tr>{columns}</tr></thead>
          <tbody>{rows}</tbody>
        </table>

        <div className="row row-end">
          {paginationDescriptor}
          <div id="pagination-buttons">{paginationButtons}</div>
        </div>
      </>
    );
  }
}

GenericTable.defaultProps = {
  className: '',          // The class name on the table element
  columns: [],            // Array of the column names
  rows: [],               // Rows to display in table
  paginated: true,        // Boolean of whether or not to show pagination
  pagesShown: 3,          // Number of buttons in pagination bar
  rowsPerPage: 10,        // Number of rows per paginated page
  onSortChange: () => {}  // Callback for when column sort changes
}

export default GenericTable;

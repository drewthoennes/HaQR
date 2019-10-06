import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import {sortByProperty} from '@/utils';
import socket from '@/socket';
import './styles.scss';

class _rolesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: '',
      asc: false
    };
  }

  componentDidMount() {
  }

  sortBy(sort) {
    if (sort === this.state.sort) {
      this.setState({asc: !this.state.asc});
      return;
    }

    this.setState({sort: sort, asc: true});
  }

  render() {
    let roles = this.props.roles.map(role => (
      <tr key={role._id}>
        <td scope="row">{role.name}</td>
        <td scope="row">
          {
            role.fields.map(field => (
              <div key={field._id}>
                <p><b>{field.name}:</b></p>
                <ul>
                  {
                    field.attributes.map(attribute => (
                      <li key={`${field}-${attribute}`}>{attribute}</li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </td>
        <td className="row justify-content-around">
          <button className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));

    return (
      <div id="_rolesView" className="tall">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" onClick={() => this.sortBy('name')}>
                <div className="row">
                  <p>Name</p>
                  <div className="column justify-content-center">
                    <FontAwesomeIcon icon={this.state.sort === 'name' ? this.state.asc ? faChevronUp : faChevronDown : faMinus}/>
                  </div>
                </div>
              </th>
              <th scope="col">
                <div className="row">
                  <p>Fields</p>
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roles}
          </tbody>
        </table>
      </div>
    );
  }
};

export default withRouter(_rolesView);

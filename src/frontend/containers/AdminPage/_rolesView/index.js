import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMinus, faChevronUp, faChevronDown, faPlus} from '@fortawesome/free-solid-svg-icons';
import {sortByProperty} from '@f/utils';
import socket from '@f/socket';
import './styles.scss';

import GenericModal from '@f/components/GenericModal';
import AddRoleModal from './AddRoleModal';
import DeleteRoleModal from './DeleteRoleModal';

class _rolesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: '',
      sort: '',
      asc: false
    };

    this.addRoleModal = React.createRef();
    this.deleteRoleModal = React.createRef();

    this.sortBy = this.sortBy.bind(this);
    this.openAddRoleModal = this.openAddRoleModal.bind(this);
    this.addRoleModalConfirm = this.addRoleModalConfirm.bind(this);
    this.addRoleModalCancel = this.addRoleModalCancel.bind(this);
    this.deleteRoleModalConfirm = this.deleteRoleModalConfirm.bind(this);
    this.deleteRoleModalCancel = this.deleteRoleModalCancel.bind(this);
  }

  sortBy(sort) {
    if (sort === this.state.sort) {
      this.setState({asc: !this.state.asc});
      return;
    }

    this.setState({sort: sort, asc: true});
  }

  openAddRoleModal() {
    this.addRoleModal.current.openModal();
  }

  addRoleModalConfirm(role) {
    let token = this.props.token;

    axios.post('/api/roles', role, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (res && res.data && !res.data.error) {
        socket.emit('updatedRoles', token);
      }

      this.addRoleModal.current.closeModal();
    });

  }

  addRoleModalCancel() {
    this.addRoleModal.current.closeModal();
  }

  openDeleteRoleModal(id) {
    this.setState({deleting: id});
    this.deleteRoleModal.current.openModal();
  }

  deleteRoleModalConfirm() {
    let token = this.props.token;

    axios.delete(`/api/roles/${this.state.deleting}`, {
      headers: {
        authorization: `token ${token}`
      }
    }).then(res => {
      if (res && res.data && !res.data.error) {
        socket.emit('updatedRoles', token);
      }

      this.deleteRoleModal.current.closeModal();
    });
  }

  deleteRoleModalCancel() {
    this.deleteRoleModal.current.closeModal();
  }

  render() {
    let roles = this.props.roles;

    roles.sort(sortByProperty(this.state.sort));

    if (!this.state.asc) {
      roles.reverse();
    }

    roles = roles.map(role => (
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
          <button className="btn btn-danger" onClick={() => this.openDeleteRoleModal(role._id)}>Delete</button>
        </td>
      </tr>
    ));

    let addRoleModal = (<AddRoleModal confirm={this.addRoleModalConfirm} cancel={this.addRoleModalCancel}/>);
    let deleteRoleModal = (<DeleteRoleModal confirm={this.deleteRoleModalConfirm} cancel={this.deleteRoleModalCancel}/>);

    return (
      <div id="_rolesView" className="tall">
        <button title="Add role" className="btn btn-blank" onClick={this.openAddRoleModal}>
          <FontAwesomeIcon icon={faPlus}/>
        </button>

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

        <GenericModal ref={this.addRoleModal} large title="Add Role" content={addRoleModal}/>
        <GenericModal ref={this.deleteRoleModal} small title="Delete Role" content={deleteRoleModal}/>
      </div>
    );
  }
};

export default withRouter(_rolesView);

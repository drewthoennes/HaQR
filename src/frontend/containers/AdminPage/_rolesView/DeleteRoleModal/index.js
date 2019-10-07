import React from "react";
import './styles.scss';

class DeleteRoleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {

    return (
        <div id="delete-role-modal">
            <div className="content">
              <p>Are you sure you want to delete this role?</p>
            </div>

            <div className="modal-buttons">
                <button className="btn" onClick={this.props.cancel}>Cancel</button>
                <button className="btn" onClick={this.props.confirm}>Delete</button>
            </div>
      </div>
    );
  }
}

DeleteRoleModal.defaultProps = {
  confirm: () => {}, // Function called on modal submission
  cancel: () => {}   // Function called on modal cancel
}

export default DeleteRoleModal;

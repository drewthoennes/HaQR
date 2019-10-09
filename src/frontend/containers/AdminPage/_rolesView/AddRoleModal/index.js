import React from "react";
import './styles.scss';
import {parseCSV} from '@f/utils';

class AddRoleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        name: '',
        fieldsCSV: '',
        fieldsCSVError: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
    this.formatFieldsMap = this.formatFieldsMap.bind(this);
    this.checkFieldsFormatting = this.checkFieldsFormatting.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleTextareaChange(event) {
    this.setState({fieldsCSV: event.target.value});
  }

  formatFieldsMap(map) {
    let fields = {};

    for (let el in map) {
      let name = map[el][0];
      let attribute = map[el][1];

      if (!fields[name]) {
        fields[name] = [];
      }

      fields[name].push(attribute);
    }

    let formatted = [];

    for (let field in fields) {
      formatted.push({
        name: field,
        attributes: fields[field]
      });
    }

    return formatted;
  }

  handleSubmission() {
    parseCSV(this.state.fieldsCSV, 2).then(map => {
      this.props.confirm({
        name: this.state.name,
        fields: this.formatFieldsMap(map)
      });
    });
  }

  checkFieldsFormatting() {
    parseCSV(this.state.fieldsCSV, 2).then(map => {
      this.setState({fieldsCSVError: undefined});
    }).catch(err => {
      this.setState({fieldsCSVError: err.message});
    });
  }

  render() {
    let fieldsError = '';

    if (this.state.fieldsCSVError) {
      fieldsError = (
        <div className="alert alert-danger" role="alert">{this.state.fieldsCSVError}</div>
      );
    }

    return (
        <div id="add-role-modal">
            <div className="content">
                <input type="text" name="name" className="form-control" placeholder="Role name" value={this.state.name} onChange={this.handleChange}/>

                <div className="card">
                    <h5 className="card-header">Role Fields</h5>
                    <div className="card-body">
                        <p className="card-text">CSV Format: Category, Field</p>
                        <textarea value={this.state.fieldsCSV} placeholder={"Swag, Backpacks\nSwag, Dad hats\nMeals, Breakfast"} onChange={this.handleTextareaChange}></textarea>
                        <div className="buttons">
                            <button className="btn btn-blank" onClick={this.checkFieldsFormatting}>Check Formatting</button>
                        </div>
                        {fieldsError}
                    </div>
                </div>
            </div>

            <div className="modal-buttons">
                <button className="btn" onClick={this.props.cancel}>Cancel</button>
                <button className="btn" onClick={this.handleSubmission}>Save Role</button>
            </div>
      </div>
    );
  }
}

AddRoleModal.defaultProps = {
  confirm: () => {}, // Function called on modal submission
  cancel: () => {}   // Function called on modal cancel
}

export default AddRoleModal;

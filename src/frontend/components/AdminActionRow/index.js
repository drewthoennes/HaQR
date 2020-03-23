import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class AdminActionRow extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  render () {
    let tooltip;

    if (this.props.tooltip) {
      tooltip = (
        <div id="setting-tooltip" className="column justify-content-center" data-toggle="tooltip" title={this.props.tooltip}>
          <FontAwesomeIcon icon={faQuestionCircle}/>
        </div>
      );
    }

    return (
      <div className="setting">
        <div className="setting-name row">
          <div className="column justify-content-center">
            <h6>{this.props.name}</h6>
          </div>
          {tooltip}
        </div>

        <button className="btn btn-gray" disabled={!this.props.hasUpdated} onClick={this.props.action}>{this.props.button}</button>
      </div>
    );
  }
}

AdminActionRow.defaultProps = {
  name:           '',       // Title to the left of the setting
  tooltip:        '',       // Tooltip further explaining setting
  button:         '',       // Text for button
  hasUpdated:     false,    // Has received response from API
  action:         () => {}  // Call action function
}

export default AdminActionRow;

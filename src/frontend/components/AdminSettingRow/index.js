import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class AdminSettingRow extends React.Component {
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

        <button className={`btn btn-${this.props.value ? 'success' : 'danger'}`} disabled={!this.props.hasUpdated} onClick={() => this.props.toggleSetting(this.props.setting)}>{this.props.value ? 'Enabled' : 'Disabled'}</button>
      </div>
    );
  }
}

AdminSettingRow.defaultProps = {
  tooltip:        '',       // Tooltip further explaining setting
  name:           '',       // Title to the left of the setting
  setting:        '',       // Setting name
  value:          false,    // Boolean setting value
  hasUpdated:     false,    // Has received response from API
  toggleSetting:  () => {}  // Sends API request to update setting
}

export default AdminSettingRow;

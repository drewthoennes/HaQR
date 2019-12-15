import React from 'react';
import './styles.scss';

class AdminSetting extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="card adminSetting">
        <div className="card-header"><h5>{this.props.name}</h5></div>
        <div className="card-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

AdminSetting.defaultProps = {
  name: '' // Title shown on card
}

export default AdminSetting;

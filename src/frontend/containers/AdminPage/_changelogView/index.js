import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

class _changelogView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
  }

  render() {
    return (
      <div id="_changelogView" className="tall">
        <p>Changelog</p>
      </div>
    );
  }
};

export default _changelogView;

import React from 'react';
import {connect} from 'react-redux';
import map from '@/store/map';
import './styles.scss';

class HackersPage extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
          <p>Hackers page</p>
      </div>
    );
  }
};

export default connect(map)(HackersPage);

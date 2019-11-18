import React from 'react';
import {connect} from 'react-redux';
import map from '@f/store/map';
import store from '@f/store';
import {} from '@f/store/actions';
import {withRouter} from 'react-router-dom';
import {authorize} from '@f/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserAlt} from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

import Topbar from '@f/containers/Topbar';

class InteractionsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidUpdate() {
    authorize(this.props.history);
  }

  render() {
    let interactions;
    let boundsCard;

    if (this.props.store.interactions.list) {
      interactions = this.props.store.interactions.list.map(interaction => (
        <div key={interaction._id} className="card row">
          <div className="card-body">
            <h5 className="card-title row row-between">
              <div className="row">
                <div className="column column-center"><FontAwesomeIcon icon={faUserAlt}/></div>
                {interaction.user.name}
              </div>
              <p>{new Date(interaction.createdAt).toDateString()} {new Date(interaction.createdAt).toTimeString().substr(0, 8)}</p>
            </h5>
            <p>{interaction.description}</p>
          </div>
          <div className={`type-bar ${interaction.type || 'other'}`}></div>
        </div>
      ));
    }

    if (this.props.store.interactions.total && this.props.store.interactions.total > 20) {
      boundsCard = (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title row">Older interactions hidden</h5>
            <p>{`There are ${this.props.store.interactions.total - this.props.store.interactions.list.length} older interactions not currently being shown`}</p>
          </div>
        </div>
      );
    }
    else if (this.props.store.interactions.total === 0) {
      boundsCard = (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title row">No interactions yet</h5>
            <p>Try out the application to see any of your changes here</p>
          </div>
        </div>
      );
    }

    return (
      <div id="interactionsPage" className="tall">
        <Topbar interactions/>
        <div className="content">
          {interactions}
          {boundsCard}
        </div>
      </div>
    );
  }
};

export default connect(map)(withRouter(InteractionsPage));

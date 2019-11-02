import React from 'react';
import Modal from 'react-modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faSmileWink, faCheck} from '@fortawesome/free-solid-svg-icons';

class GenericModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showModal: false,
      loading: true,
      error: '',
      styles: {
        modal: {
          content : {
            top: '50%',
            left: '50%',
            height: 'auto',
            width: 'auto',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column'
          },
          title: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }
        },
        close: {
        }
      }
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false, loading: true, error: ''});
  }

  onSuccess() {
    this.setState({loading: false});
    setTimeout(function() {
      this.closeModal();
    }.bind(this), 800);
  }

  onError(err) {
    this.setState({loading: false, error: err});
  }

  render () {
    let content;

    if (this.state.loading) {
      content = (
        <div className="row row-center tall">
          <div className="column column-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      );
    }
    else if (this.state.error === '') {
      content = (
        <div className="row row-center tall">
          <div className="column column-center">
            <FontAwesomeIcon icon={faCheck}/>
          </div>
        </div>
      );
    }
    else {
      content = (
        <div>
          <div style={this.state.styles.modal.title}>
            <FontAwesomeIcon icon={faSmileWink} style={{'visibility': 'hidden'}}/>
            <h3 style={{'margin': '0px'}}>Error</h3>
            <div style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center'}}>
              <FontAwesomeIcon icon={faTimes} onClick={this.closeModal} style={{'fontSize': '20px', 'cursor': 'pointer'}}/>
            </div>
          </div>

          <div className="row row-center tall">
            <div className="column column-center">
              {this.state.error}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Modal
          contentLabel="GenericModal"
          isOpen={this.state.showModal}
          style={this.state.styles.modal}>
          {content}
        </Modal>
      </div>
    );
  }
}

GenericModal.defaultProps = {
  small: false,  // Sets modal size to small
  medium: false, // Sets modal size to medium
  large: false,  // Sets modal size to large
  title: '',     // Text at the top of the modal
  content: ''    // JSX content inside the modal
}

export default GenericModal;

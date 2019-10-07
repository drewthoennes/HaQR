import React from 'react';
import Modal from 'react-modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faSmileWink} from '@fortawesome/free-solid-svg-icons';

class GenericModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showModal: false,
      styles: {
        modal: {
          content : {
            top: '50%',
            left: '50%',
            width: '50%',
            height: '50%',
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
            justifyContent: 'space-between'
          }
        },
        close: {
        }
      }
    };

    if (this.props.small) {
      this.state.styles.modal.content.height ='35%';
      this.state.styles.modal.content.width ='40%';
    }
    else if (this.props.medium) {
      this.state.styles.modal.content.height ='50%';
      this.state.styles.modal.content.width ='50%';
    }
    else if (this.props.large) {
      this.state.styles.modal.content.height ='75%';
      this.state.styles.modal.content.width ='75%';
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  render () {
    return (
      <div>
        <Modal
          contentLabel="GenericModal"
          isOpen={this.state.showModal}
          style={this.state.styles.modal}>
          <div style={this.state.styles.modal.title}>
            <FontAwesomeIcon icon={faSmileWink} style={{'visibility': 'hidden'}}/>
            <h3 style={{'margin': '0px'}}>{this.props.title}</h3>
            <div style={{'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center'}}>
              <FontAwesomeIcon icon={faTimes} onClick={this.closeModal} style={{'fontSize': '20px', 'cursor': 'pointer'}}/>
            </div>
          </div>
          {this.props.content}
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

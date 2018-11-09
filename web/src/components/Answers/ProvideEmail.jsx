import React from 'react';
import { PropTypes } from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';

class ProvideEmail extends React.Component {
  setEmail = () => {
    localStorage.setItem('emailForSignIn', 'gaga@gagam');
    this.props.closeModal();
  }
  render() {
    return (
      <Modal open>
        <Modal.Content>
          Geben Sie Ihre Email ein
          <Button onClick={this.setEmail}>Send</Button>
        </Modal.Content>
      </Modal>
    );
  }
}
ProvideEmail.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ProvideEmail;

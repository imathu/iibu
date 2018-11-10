import React from 'react';
import { PropTypes } from 'prop-types';
import { Modal, Button, Form, Input } from 'semantic-ui-react';

class ProvideEmail extends React.Component {
  state = {
    email: '',
  }
  onSubmit = () => {
    localStorage.setItem('emailForSignIn', this.state.email);
    this.props.closeModal();
  }
  setEMail = (email) => {
    this.setState({ email });
  }
  render() {
    const { email } = this.state;
    const isInvalid = (email === '');
    return (
      <Modal open size="tiny">
        <Modal.Content>
          <Form error onSubmit={this.onSubmit}>
            <Form.Field
              id="email"
              icon="user"
              iconPosition="left"
              fluid
              control={Input}
              placeholder="Mail"
              value={email}
              onChange={event => this.setEMail(event.target.value)}
            />
            <Button disabled={isInvalid} type="submit">Sign In</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
ProvideEmail.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ProvideEmail;

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import { auth } from '../../firebase';

const SignInEmailPage = props => (
  <div>
    <Segment style={{
       textAlign: 'center',
       width: '60%',
       vertical: true,
       margin: 'auto',
       marginTop: '20px',
      }}
    >
      <h1>SignIn with your email address</h1>
      <SignInForm {...props} />
    </Segment>
  </div>
);

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});
const INITIAL_STATE = {
  email: '',
  error: null,
  message: null,
};

class SignInForm extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = (event) => {
    const {
      email,
    } = this.state;
    event.preventDefault();
    auth.doSignInWithEmail(email, this.props.projectId, this.props.feedbackerId)
      .then(() => {
        this.setState(() => ({ message: 'you received an email to continue login' }));
        localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });
  }
  render() {
    const {
      email,
      error,
      message,
    } = this.state;
    const isInvalid =
  email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">Sign In</button>
        { error && <p>{error.message}</p> }
        { message && <p>{message}</p> }
      </form>
    );
  }
}
export default withRouter(SignInEmailPage);
export { SignInForm };

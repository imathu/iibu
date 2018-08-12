import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { PasswordResetLink } from 'components/SignIn/PasswordReset';
import { Segment } from 'semantic-ui-react';
import * as routes from 'constants/routes';

import { SignUpLink } from './SignUp';
import { auth } from '../../firebase';

const SignInPage = ({ history }) => (
  <div>
    <Segment style={{
       textAlign: 'center',
       width: '60%',
       vertical: true,
       margin: 'auto',
       marginTop: '20px',
      }}
    >
      <h1>Login</h1>
      <SignInForm history={history} />
      <hr />
      <SignUpLink />
      <PasswordResetLink />
    </Segment>
  </div>
);
SignInPage.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

// <Loader active inline="centered" />

class SignInForm extends Component {
  static propTypes = {
    history: PropTypes.shape({}).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;
    const {
      history,
    } = this.props;
    event.preventDefault();
    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.LANDING);
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
      });
  }
  render() {
    const {
      email,
      password,
      error,
    } = this.state;
    const isInvalid =
  password === '' ||
  email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <input
          value={password}
          onChange={event => this.setState(byPropKey('password', event.target.value))}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">Sign In</button>
        { error && <p>{error.message}</p> }
      </form>
    );
  }
}
export default withRouter(SignInPage);
export { SignInForm };

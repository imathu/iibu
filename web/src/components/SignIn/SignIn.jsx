import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import { PasswordResetLink } from 'components/SignIn/PasswordReset';
import { Segment } from 'semantic-ui-react';
import * as routes from 'constants/routes';

import { SignUpLink } from './SignUp';
import { auth } from '../../firebase';

const SignInPage = props => (
  // const parsed = queryString.parse(location.search);
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
      <SignInForm {...props} />
      <hr />
      <SignUpLink />
      <PasswordResetLink />
    </Segment>
  </div>
);

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
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  };
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
        const parsed = queryString.parse(this.props.location.search);
        if (parsed.feedbackerId && parsed.projectId) {
          history.push(`/answers/${parsed.projectId}/${parsed.feedbackerId}`);
        } else {
          history.push(routes.LANDING);
        }
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

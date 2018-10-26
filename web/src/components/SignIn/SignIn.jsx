import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import { PasswordResetLink } from 'components/SignIn/PasswordReset';
import LanguageContext from 'components/LanguageContext';
import { Segment, Input, Form, Button, Message } from 'semantic-ui-react';
import Language from 'components/Language';
import * as routes from 'constants/routes';

import { SignUpLink } from './SignUp';
import { auth, codes } from '../../firebase';

const SignInPage = props => (
  <div>
    <Language languages={{ en: 'true' }} />
    <Segment
      compact
      style={{
       textAlign: 'center',
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
  error: null,
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
        const parsed = qs.parse(this.props.location.search.slice(1));
        if (parsed.feedbackerId && parsed.projectId) {
          history.push(`/answers/${parsed.projectId}/${parsed.feedbackerId}`);
        } else {
          history.push(routes.LANDING);
        }
      })
      .catch((error) => {
        this.setState({ error });
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
      <LanguageContext.Consumer>
        {lang => (
          <Form error onSubmit={this.onSubmit}>
            <Form.Field
              id="email"
              fluid
              control={Input}
              placeholder="Mail"
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
            />
            <Form.Field
              id="password"
              fluid
              control={Input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={event => this.setState(byPropKey('password', event.target.value))}
            />
            { error &&
              <Message error content={codes.errCode(error, lang.language)} />
            }
            <Button disabled={isInvalid} type="submit">Sign In</Button>
          </Form>
        )}
      </LanguageContext.Consumer>
    );
  }
}
export default withRouter(SignInPage);
export { SignInForm };

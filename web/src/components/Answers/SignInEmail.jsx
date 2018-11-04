import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import { Segment, Input, Form, Button, Message } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import PopUp from 'components/PopUp';
import { FormattedMessage } from 'react-intl';

import { auth, codes } from '../../firebase';

const SignInEmailPage = (props) => {
  const { projectId, feedbackerId } = props.match.params;
  return (
    <div>
      <Segment
        compact
        style={{
         textAlign: 'center',
         vertical: true,
         margin: 'auto',
         marginTop: '20px',
        }}
      >
        <h1>
          <FormattedMessage
            id="feedback.SignInEmail"
            defaultMessage="One-time Login Email Adresse"
            values={{ what: 'react-intl' }}
          />
        </h1>
        <SignInForm {...props} />
        <div style={{ marginTop: '10px' }}>
          <FormattedMessage
            id="feedback.SignInEmailAlternative"
            defaultMessage="alternative signup with email/password"
            values={{ what: 'react-intl' }}
          />&nbsp;
          {// eslint-disable-next-line
            <Link
              to={{
                  pathname: routes.SIGN_IN,
                  search: `?projectId=${projectId}&feedbackerId=${feedbackerId}`,
              }}
            >Sign In
            </Link>
          }
        </div>
      </Segment>
    </div>
  );
};
SignInEmailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }).isRequired,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null,
});
const INITIAL_STATE = {
  email: '',
  error: null,
  message: null,
  showMessage: false,
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
        this.setState({ showMessage: true });
        localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }
  closeMessage = () => {
    this.setState({ showMessage: false });
    this.setState(() => ({ ...INITIAL_STATE }));
  }
  render() {
    const {
      email,
      error,
      showMessage,
    } = this.state;
    const isInvalid =
  email === '';
    return (
      <LanguageContext.Consumer>
        {lang => (
          <React.Fragment>
            <Form error onSubmit={this.onSubmit}>
              <Form.Field
                id="email"
                icon="user"
                iconPosition="left"
                fluid
                control={Input}
                placeholder="Mail"
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
              />
              { error &&
                <Message error content={codes.errCode(error, lang.language)} />
              }
              <Button disabled={isInvalid} type="submit">Sign In</Button>
            </Form>
            <PopUp
              open={showMessage}
              messageId="feedback.passwordSent"
              close={this.closeMessage}
            />
          </React.Fragment>
        )}
      </LanguageContext.Consumer>
    );
  }
}
export default withRouter(SignInEmailPage);
export { SignInForm };

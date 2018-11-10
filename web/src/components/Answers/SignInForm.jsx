import React from 'react';
import { PropTypes } from 'prop-types';
import LanguageContext from 'components/LanguageContext';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import PopUp from 'components/PopUp';

import { auth, codes } from '../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null,
});
const INITIAL_STATE = {
  email: '',
  error: null,
  message: null,
  showMessage: false,
  tokenError: null,
};

class SignInForm extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    tokenError: PropTypes.shape({}),
    clearError: PropTypes.func.isRequired,
  };
  static defaultProps = {
    tokenError: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      email: localStorage.getItem('emailForSignIn') || '',
    };
  }
  onSubmit = (event) => {
    const {
      email,
    } = this.state;
    event.preventDefault();
    this.props.clearError();
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
    const { tokenError } = this.props;
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
              { tokenError &&
                <Message error content={codes.errCode(tokenError, lang.language)} />
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

export default SignInForm;

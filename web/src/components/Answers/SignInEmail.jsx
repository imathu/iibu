import React from 'react';
import { PropTypes } from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import { Segment } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import SignInForm from './SignInForm';
import ProvideEmail from './ProvideEmail';

import { auth } from '../../firebase';

class SignInEmailPage extends React.Component {
  state = {
    modal: false,
    error: null,
  }
  componentDidMount = () => {
    this.checkMail();
  }
  closeModal = () => {
    this.setState({ modal: false });
    this.checkMail();
  }
  clearError = () => {
    this.setState({ error: null });
  }
  checkMail = () => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      this.setState(() => ({ loading: true }));
      const email = localStorage.getItem('emailForSignIn');
      if (!email) {
        this.setState({ modal: true });
      }
      if (email) {
        auth.signInWithEmailLink(email, window.location.href)
          .then((result) => {
            // localStorage.removeItem('emailForSignIn');
            this.setState(() => ({ error: null, loading: false, authUser: result.user }));
          })
          .catch((error) => {
            this.setState({ error });
            // localStorage.removeItem('emailForSignIn');
          });
      }
    }
  }
  render() {
    const { projectId, feedbackerId } = this.props.match.params;
    const { modal, error } = this.state;
    if (modal) {
      return (
        <ProvideEmail closeModal={this.closeModal} />
      );
    }
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
          <SignInForm {...this.props} tokenError={error} clearError={this.clearError} />
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
  }
}
SignInEmailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }).isRequired,
};


export default withRouter(SignInEmailPage);

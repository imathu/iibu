import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthUserContext from 'components/AuthUserContext';
import { Loader } from 'semantic-ui-react';


import { auth } from '../../firebase';
import Content from './Content';
import SignInEmail from './SignInEmail';
import ProvideEmail from './ProvideEmail';

import './Answers.css';

class Answers extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        clientId: PropTypes.string,
        feedbackerId: PropTypes.string.isRequired,
        projectId: PropTypes.string,
      }),
    }).isRequired,
  }
  state = {
    error: null,
    modal: false,
    loading: false,
  };
  componentDidMount = () => {
    this.checkMail();
  }
  closeModal = () => {
    this.setState({ modal: false });
    this.checkMail();
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
            localStorage.removeItem('emailForSignIn');
            this.setState(() => ({ error: null, loading: false, authUser: result.user }));
          })
          .catch((error) => {
            this.setState({ error, loading: false });
            console.log(error);
            localStorage.removeItem('emailForSignIn');
          });
      }
    }
  }
  clearError = () => {
    this.setState({ error: null });
  }
  render() {
    const { error, modal, loading } = this.state;
    const { projectId, feedbackerId } = this.props.match.params;
    if (modal) {
      return (
        <ProvideEmail closeModal={this.closeModal} />
      );
    }
    if (loading) {
      return <Loader />;
    }
    return (
      <AuthUserContext.Consumer>
        {user => (user
          ?
            <div id="answers-content">
              <Content
                user={user}
                projectId={projectId}
                feedbackerId={feedbackerId}
              />
            </div>
          :
            <SignInEmail
              tokenError={error}
              projectId={projectId}
              feedbackerId={feedbackerId}
              clearError={this.clearError}
            />
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withRouter(Answers);

import React from 'react';
import { PropTypes } from 'prop-types';
import AuthUserContext from 'components/AuthUserContext';
import { Loader } from 'semantic-ui-react';


import { auth } from '../../firebase';
import AnswersList from './AnswersList';
import SignInEmail from './SignInEmail';

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
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = () => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      this.setState(() => ({ loading: true }));
      let email = localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation'); // eslint-disable-line no-alert
      }
      auth.signInWithEmailLink(email, window.location.href)
        .then((result) => {
          localStorage.removeItem('emailForSignIn');
          this.setState(() => ({ loading: false, authUser: result.user }));
        })
        .catch(() => {
          this.setState(() => ({ loading: false }));
        });
    }
  }
  render() {
    const { loading } = this.state;
    const { projectId, feedbackerId } = this.props.match.params;
    if (loading) {
      return <Loader />;
    }
    return (
      <AuthUserContext.Consumer>
        {user => (user
          ?
            <div id="answers-content">
              <AnswersList
                user={user}
                projectId={projectId}
                feedbackerId={feedbackerId}
              />
            </div>
          :
            <SignInEmail projectId={projectId} feedbackerId={feedbackerId} />
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default Answers;

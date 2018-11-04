import React from 'react';
import { PropTypes } from 'prop-types';
import AuthUserContext from 'components/AuthUserContext';
import { FormattedMessage } from 'react-intl';
import { Loader, Segment, Header } from 'semantic-ui-react';


import { auth, db } from '../../firebase';
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
  }
  state = {
    loading: false,
    activeFlag: false,
    feedbackerNotActive: false,
  };
  componentDidMount = () => {
    const { projectId, feedbackerId } = this.props.match.params;
    db.getActiveFlag(projectId).on('value', (snapshot) => {
      this.setState(() => ({ activeFlag: snapshot.val() }));
    });
    db.getFeedbackerActiveFlag(projectId, feedbackerId).on('value', (snapshot) => {
      this.setState(() => ({ feedbackerNotActive: snapshot.val() }));
    });
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
    const { loading, activeFlag, feedbackerNotActive } = this.state;
    const { projectId, feedbackerId } = this.props.match.params;
    if (loading) {
      return <Loader />;
    }
    if (!activeFlag && !loading) {
      return (
        <Segment
          style={{ margin: '10px', textAlign: 'center' }}
        >
          <Header as="h2">
            <FormattedMessage
              id="feedback.closedHeader"
              defaultMessage="Der Feedbackbogen ist nicht aktiv"
              values={{ what: 'react-intl' }}
            />
          </Header>
          <FormattedMessage
            id="feedback.closedContent"
            defaultMessage="Für Fragen wenden Sie sich an den Organisator"
            values={{ what: 'react-intl' }}
          />
        </Segment>
      );
    }
    if (feedbackerNotActive && !loading) {
      return (
        <Segment
          style={{ margin: '10px', textAlign: 'center' }}
        >
          <Header as="h2">
            <FormattedMessage
              id="feedback.finishedHeader"
              defaultMessage="Erfolgreich abgeschlossen"
              values={{ what: 'react-intl' }}
            />
          </Header>
          <FormattedMessage
            id="feedback.finishedContent"
            defaultMessage="herzlichen Dank für Ihre Teilnahme"
            values={{ what: 'react-intl' }}
          />
        </Segment>
      );
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

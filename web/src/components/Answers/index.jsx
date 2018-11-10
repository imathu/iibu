import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthUserContext from 'components/AuthUserContext';
import SignInEmail from './SignInEmail';

import Content from './Content';

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
  }

  render() {
    const { projectId, feedbackerId } = this.props.match.params;
    const { error } = this.state;
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

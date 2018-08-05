import React from 'react';
import { PropTypes } from 'prop-types';
import { Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';

import { firebase, auth } from '../../firebase';
import AnswersList from './AnswersList';
import SignInEmail from './SignInEmail';

import './Answers.css';

class Answers extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
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
      data: null,
      authUser: null,
      loading: false,
    };
  }
  componentDidMount = () => {
    const { projectId, feedbackerId } = this.props.match.params;
    const API = `/api/v1/${projectId}/answers/${feedbackerId}`;
    firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        firebase.auth.currentUser.getIdToken(true).then((idToken) => {
          fetch(API, { headers: { Authorization: idToken } })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('not authorized');
            })
            .then((data) => {
              if (!data.err) {
                this.setState({ data });
              } else {
                throw new Error('an unexpected error occured', data.err);
              }
            }).catch((e) => {
              alert(e); // eslint-disable-line
              this.props.history.push(routes.LANDING);
            });
        }).catch((error) => {
          console.log(error); // eslint-disable-line
        });
        this.setState(() => ({ authUser }));
      } else {
        this.setState(() => ({ authUser: null }));
      }
    });
    if (auth.isSignInWithEmailLink(window.location.href)) {
      this.setState(() => ({ loading: true }));
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      auth.signInWithEmailLink(email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          this.setState(() => ({ loading: false }));
        })
        .catch(() => {
          this.setState(() => ({ loading: false }));
        });
    }
  }
  render() {
    const { data, authUser, loading } = this.state;
    const { projectId, feedbackerId } = this.props.match.params;
    if (loading) {
      return <Loader />;
    }
    return (
      (authUser)
        ?
          <div id="answers-content">
            {(data)
              ? <AnswersList data={data} projectId={projectId} feedbackerId={feedbackerId} />
              : <Loader active inline="centered" />
            }
          </div>
        :
          <SignInEmail projectId={projectId} feedbackerId={feedbackerId} />
    );
  }
}

export default withRouter(Answers);

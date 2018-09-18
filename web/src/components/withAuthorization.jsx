import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import AuthUserContext from 'components/AuthUserContext';
import * as routes from 'constants/routes';
import { firebase } from '../firebase';

const withAuthorization = authCondition => (Component) => {
  class WithAuthorization extends React.Component {
    static propTypes = {
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
      }).isRequired,
    }

    componentDidMount() {
      firebase.auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          authUser.getIdTokenResult()
            .then((idTokenResult) => {
              if (!authCondition(authUser, idTokenResult.claims.admin)) {
                this.props.history.push(routes.SIGN_IN);
              }
            })
            .catch(() => this.props.history.push(routes.SIGN_IN));
        } else {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <Component {...this.props} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }
  return withRouter(WithAuthorization);
};

export default withAuthorization;

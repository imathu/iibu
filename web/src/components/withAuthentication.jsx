import React from 'react';
import { firebase } from '../firebase';
import AuthUserContext from './AuthUserContext';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        auth: null,
      };
    }
    componentDidMount() {
      firebase.auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          authUser.getIdTokenResult()
            .then((idTokenResult) => {
              console.log(idTokenResult);
              this.setState(() => ({
                auth: {
                  authUser,
                  admin: idTokenResult.claims.admin,
                },
              }));
            })
            .catch((error) => {
              console.log(error); // eslint-disable-line no-console
            });
        } else {
          this.setState(() => ({ auth: null }));
        }
      });
    }
    render() {
      const { auth } = this.state;
      return (
        <AuthUserContext.Provider value={auth}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return WithAuthentication;
};
export default withAuthentication;

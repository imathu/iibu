import React from 'react';
import { firebase, db } from '../firebase';
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
          db.isAdmin(authUser.uid)
            .then((snapshot) => {
              this.setState(() => ({
                auth: {
                  authUser,
                  admin: snapshot.exists(),
                },
              }));
            })
            .catch(() => {
              this.setState(() => ({
                auth: {
                  authUser,
                  admin: false,
                },
              }));
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

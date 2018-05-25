import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from 'components/Navigation';
import LandingPage from 'components/Landing';
import ProjectsPage from 'components/Projects/Projects';
import ProjectPage from 'components/Projects/Project';
import AdminPage from 'components/Admin/Admin';
import Answers from 'components/Answers';

import * as routes from 'constants/routes';

import withAuthentication from 'components/withAuthentication';

import SignUpPage from 'components/SignUp';
import SignInPage from 'components/SignIn';
// import PasswordForgetPage from 'components/PasswordForget';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <Navigation />
      <Route
        exact
        path={routes.LANDING}
        component={LandingPage}
      />
      <Route
        exact
        path={routes.PROJECTS}
        component={ProjectsPage}
      />
      <Route
        path={routes.ADMIN}
        component={AdminPage}
      />
      <Route
        path={routes.PROJECT}
        component={ProjectPage}
      />
      <Route
        path={routes.SIGN_IN}
        component={SignInPage}
      />
      <Route
        path={routes.SIGN_UP}
        component={SignUpPage}
      />
      <Route
        path={routes.ANSWERS}
        component={Answers}
      />
    </div>
  </Router>
);

// export default(App);

export default withAuthentication(App);

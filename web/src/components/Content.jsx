import React from 'react';
import { Route } from 'react-router-dom';

import LandingPage from 'components/Landing';
import ProjectEdit from 'components/Projects/ProjectEdit';
import ProjectsPage from 'components/Projects/Projects';
import ProjectPage from 'components/Projects/Project';
import AdminPage from 'components/Admin/Admin';
import Answers from 'components/Answers';

import * as routes from 'constants/routes';

import withAuthentication from 'components/withAuthentication';

import SignUpPage from 'components/SignIn/SignUp';
import SignInPage from 'components/SignIn/SignIn';
import PasswordResetPage from 'components/SignIn/PasswordReset';

const Content = () => (
  <div className="App">
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
      exact
      path={routes.PROJECT_EDIT}
      component={ProjectEdit}
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
      path={routes.PASSWORD_RESET}
      component={PasswordResetPage}
    />
    <Route
      path={routes.ANSWERS}
      component={Answers}
    />
  </div>
);

export default withAuthentication(Content);

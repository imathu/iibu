import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Navigation } from 'components/Navigation';
import LandingPage from 'components/Landing';
import ProjectsPage from 'components/Projects/Projects';
import ProjectPage from 'components/Projects/Project';
import AdminPage from 'components/Admin/Admin';

import * as routes from 'constants/routes';

import 'semantic-ui-css/semantic.min.css';
import './App.css';


const App = () => (
  <Router>
    <div className="App">
      <Navigation />
      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact
        path={routes.PROJECTS}
        component={() => <ProjectsPage />}
      />
      <Route
        path={routes.ADMIN}
        component={props => <AdminPage {...props} />}
      />
      <Route
        path={routes.PROJECT}
        component={props => <ProjectPage {...props} />}
      />
    </div>
  </Router>
);

export default App;

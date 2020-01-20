import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Grid, Menu } from 'semantic-ui-react';
import withAuthorization from 'components/withAuthorization';

import * as routes from 'constants/routes';
import Roles from './Roles';
import Contexts from './Contexts';
import Users from './Users';
import Templates from './Templates';

export const Admin = () => (
  <div className="admin-content">
    <Grid>
      <Grid.Column width={4}>
        <h1>admin menu</h1>
        <Menu fluid vertical pointing>
          <Menu.Item
            name="Rollen"
            as={NavLink}
            to="/admin/roles"
            exact
          />
          <Menu.Item
            name="Themen"
            as={NavLink}
            to="/admin/contexts"
            exact
          />
          <Menu.Item
            name="users"
            as={NavLink}
            to="/admin/users"
            exact
          />
          <Menu.Item
            name="templates"
            as={NavLink}
            to="/admin/templates"
            exact
          />
        </Menu>
      </Grid.Column>
      <Grid.Column stretched width={12}>
        <Route
          path={routes.ADMIN}
          exact
          component={props => <Roles {...props} />}
        />
        <Route
          path={routes.ADMIN_ROLES}
          exact
          component={props => <Roles {...props} />}
        />
        <Route
          path={routes.ADMIN_CONTEXTS}
          exact
          component={props => <Contexts {...props} />}
        />
        <Route
          path={routes.ADMIN_USERS}
          exact
          component={props => <Users {...props} />}
        />
        <Route
          path={routes.ADMIN_TEMPLATES}
          exact
          component={props => <Templates {...props} />}
        />
      </Grid.Column>
    </Grid>
  </div>
);

const authCondition = (authUser, admin) => (!!authUser && admin);
export default withAuthorization(authCondition)(Admin);

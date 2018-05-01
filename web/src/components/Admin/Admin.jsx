import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Grid, Menu, Segment } from 'semantic-ui-react';

import * as routes from 'constants/routes';
import Roles from './Roles';
import Contexts from './Contexts';

export const Admin = () => (
  <div className="admin-content">
    <Grid>
      <Grid.Column width={4}>
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
        </Menu>
      </Grid.Column>

      <Grid.Column stretched width={12}>
        <Segment>
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
        </Segment>
      </Grid.Column>
    </Grid>
  </div>
);

export default Admin;

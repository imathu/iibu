import React from 'react';

import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import * as routes from 'constants/routes';

export const Navigation = () => (
  <div className="navigation">
    <Menu
      pointing
      secondary
    >
      <Menu.Item>
        iibu.ch
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          name="home"
          as={NavLink}
          to={routes.LANDING}
          exact
        />
        <Menu.Item
          name="projects"
          as={NavLink}
          to={routes.PROJECTS}
          exact
        />
        <Menu.Item
          name="admin"
          as={NavLink}
          to={routes.ADMIN_ROLES}
          exact
        />
        <Menu.Item
          name="login"
          as={NavLink}
          to={routes.SIGN_IN}
          exact
        />
      </Menu.Menu>
    </Menu>
  </div>
);

export default Navigation;

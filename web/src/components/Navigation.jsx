import React from 'react';
import { PropTypes } from 'prop-types';

import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import * as routes from 'constants/routes';

import AuthUserContext from 'components/AuthUserContext';
import SignOutButton from 'components/SignOut';

const NavigationNonAuth = () => (
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
          name="sign_in"
          as={NavLink}
          to={routes.SIGN_IN}
          exact
        />
      </Menu.Menu>
    </Menu>
  </div>
);

const NavigationAuth = ({ authUser }) => (
  <div className="navigation">
    <Menu
      pointing
      secondary
    >
      <Menu.Item>
        iibu.ch -  {authUser.email}
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
        <Menu.Item>
          <SignOutButton />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  </div>
);
NavigationAuth.propTypes = {
  authUser: PropTypes.shape({}).isRequired,
};

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser => ((authUser)
      ? <NavigationAuth authUser={authUser} />
      : <NavigationNonAuth />
    )}
  </AuthUserContext.Consumer>
);

export default Navigation;

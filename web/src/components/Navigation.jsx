import React from 'react';
import { PropTypes } from 'prop-types';

import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

import * as routes from 'constants/routes';

import AuthUserContext from 'components/AuthUserContext';
import SignOutButton from 'components/SignIn/SignOut';
import Language from 'components/Language';

const NavigationNonAuth = () => (
  <div className="navigation">
    <Menu
      pointing
      secondary
      stackable
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
      <Language />
    </Menu>
  </div>
);

const NavigationAuth = ({ auth }) => {
  const { admin } = auth;
  return (
    <div className="navigation">
      <Menu
        pointing
        secondary
        stackable
      >
        <Menu.Item>
          iibu.ch -  {auth.authUser.email}
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item
            name="home"
            as={NavLink}
            to={routes.LANDING}
            exact
          />
          { (admin) &&
            <React.Fragment>
              <Menu.Item
                name="projekte"
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
            </React.Fragment>
          }
          <Language />
          <Menu.Item>
            <SignOutButton />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
};
NavigationAuth.propTypes = {
  auth: PropTypes.shape({}).isRequired,
};

const Navigation = () => (
  <AuthUserContext.Consumer>
    {auth => ((auth)
      ? <NavigationAuth auth={auth} />
      : <NavigationNonAuth />
    )}
  </AuthUserContext.Consumer>
);

export default Navigation;

import React from 'react';
import { PropTypes } from 'prop-types';

import { Menu, Responsive, Segment, Container } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

import * as routes from 'constants/routes';

import Content from 'components/Content';

import AuthUserContext from 'components/AuthUserContext';

import { auth as fbAuth } from '../../firebase';

const AdminMenu = () => (
  <Menu.Menu position="right">
    <Menu.Item
      name="projekte"
      as={NavLink}
      to={routes.PROJECTS}
      onClick={this.handleToggle}
      exact
    />
    <Menu.Item
      name="admin"
      as={NavLink}
      to={routes.ADMIN_ROLES}
      onClick={this.handleToggle}
      exact
    />
    <Menu.Item onClick={() => fbAuth.doSignOut()}>Logout</Menu.Item>
  </Menu.Menu>
);

const NonAdminMenu = ({ auth }) => (
  <Menu.Menu position="right">
    {auth
      ? <Menu.Item onClick={() => fbAuth.doSignOut()}>Logout</Menu.Item>
      : <Menu.Item
        position="right"
        name="login"
        as={Link}
        to={routes.SIGN_IN}
      />
    }
  </Menu.Menu>
);
NonAdminMenu.propTypes = {
  auth: PropTypes.shape({}),
};
NonAdminMenu.defaultProps = {
  auth: null,
};

const NavigationDesktop = () => (
  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
    <AuthUserContext.Consumer>
      {auth => (
        <React.Fragment>
          <Segment
            inverted
            textAlign="center"
            vertical
          >
            <Menu
              inverted
              pointing
              secondary
            >
              <Container>
                <Menu.Item
                  as={Link}
                  to={routes.LANDING}
                ><h1>iibu Feedbackanalyse</h1>
                </Menu.Item>
                {auth && auth.admin
                ? <AdminMenu />
                : <NonAdminMenu auth={auth} />
                }
              </Container>
            </Menu>
          </Segment>
          <Content />
        </React.Fragment>
      )}
    </AuthUserContext.Consumer>
  </Responsive>
);

export default NavigationDesktop;

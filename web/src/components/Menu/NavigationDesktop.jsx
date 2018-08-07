import React from 'react';

import { Menu, Responsive, Segment, Container } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

import * as routes from 'constants/routes';

import Content from 'components/Content';
import Language from 'components/Language';

import AuthUserContext from 'components/AuthUserContext';

import { auth as fbAuth } from '../../firebase';

class NavigationDesktop extends React.Component {
  render() {
    return (
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
                    {auth
                    ?
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
                    :
                      <Menu.Item
                        position="right"
                        name="login"
                        as={Link}
                        to={routes.SIGN_IN}
                      />
                    }
                  </Container>
                </Menu>
              </Segment>
              <Language />
              <Content />
            </React.Fragment>
          )}
        </AuthUserContext.Consumer>
      </Responsive>
    );
  }
}

export default NavigationDesktop;

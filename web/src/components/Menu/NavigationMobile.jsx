import React from 'react';

import { Menu, Responsive, Sidebar, Segment, Icon, Container } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';

import * as routes from 'constants/routes';

import Content from 'components/Content';

import AuthUserContext from 'components/AuthUserContext';

import { auth as fbAuth } from '../../firebase';

class NavigationMobile extends React.Component {
  state = {}
  handlePusherClick = () => {
    const { sidebarOpened } = this.state;
    if (sidebarOpened) this.setState({ sidebarOpened: false });
  }
  handleToggle = () => this.setState(() => ({ sidebarOpened: !this.state.sidebarOpened }))
  signOut = () => {
    this.handleToggle();
    fbAuth.doSignOut();
  }
  render() {
    const { sidebarOpened } = this.state;
    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <AuthUserContext.Consumer>
          {auth => (
            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                inverted
                vertical
                visible={sidebarOpened}
                direction="right"
              >
                {auth && auth.admin && (
                  <React.Fragment>
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
                  </React.Fragment>
                )}
                {!auth
                  ?
                    <Menu.Item
                      name="login"
                      as={NavLink}
                      to={routes.SIGN_IN}
                      exact
                    />
                  :
                    <Menu.Item onClick={this.signOut}>Log out</Menu.Item>
                }
              </Sidebar>
              <Sidebar.Pusher
                dimmed={sidebarOpened}
                onClick={this.handlePusherClick}
                style={{ minHeight: '100vh' }}
              >
                <Segment
                  inverted
                  textAlign="center"
                  style={{ padding: '1em 0em' }}
                  vertical
                >
                  <Container>
                    <Menu inverted pointing secondary size="large">
                      <Menu.Item
                        as={Link}
                        to={routes.LANDING}
                      ><h3>iibu Feedbackanalyse</h3>
                      </Menu.Item>
                      {auth
                        ?
                          <Menu.Item onClick={this.handleToggle} position="right">
                            <Icon name="sidebar" />
                          </Menu.Item>
                        :
                          <Menu.Item
                            position="right"
                            name="login"
                            as={Link}
                            to={routes.SIGN_IN}
                          />
                      }
                    </Menu>
                  </Container>
                </Segment>
                <Content />
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          )}
        </AuthUserContext.Consumer>
      </Responsive>
    );
  }
}

export default NavigationMobile;

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Route, NavLink } from 'react-router-dom';
import { Grid, Menu, Segment } from 'semantic-ui-react';

import * as routes from 'constants/routes';
import Questions from './Questions';
import Clients from './Clients';
import Feedbackers from './Feedbackers';
import { Analysis } from './Analysis';

class Project extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }).isRequired,
    item: PropTypes.string,
  }
  static defaultProps = {
    item: 'fragen',
  }
  constructor(props) {
    super(props);
    this.state = {
      params: this.props.match.params,
    };
  }

  render() {
    const { projectId } = this.state.params;
    return (
      <div className="admin-content">
        <Grid>
          <Grid.Column width={4}>
            <Menu fluid vertical pointing>
              <Menu.Item
                name="fragen"
                as={NavLink}
                to={`/project/${projectId}/fragen`}
                exact
              />
              <Menu.Item
                name="feedbacknehmer"
                as={NavLink}
                to={`/project/${projectId}/feedbacknehmer`}
                exact
              />
              <Menu.Item
                name="feedbackgeber"
                as={NavLink}
                to={`/project/${projectId}/feedbackgeber`}
                exact
              />
              <Menu.Item
                name="analyse"
                as={NavLink}
                to={`/project/${projectId}/analyse`}
                exact
              />
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={12}>
            <Segment>
              <Route
                path={routes.PROJECT}
                exact
                component={props => <Questions {...props} />}
              />
              <Route
                path={routes.PROJECT_FRAGEN}
                exact
                component={props => <Questions {...props} />}
              />
              <Route
                path={routes.PROJECTS_ANALYSE}
                exact
                component={props => <Analysis {...props} />}
              />
              <Route
                path={routes.PROJECTS_FEEDBACKGEBER}
                exact
                component={props => <Feedbackers {...props} />}
              />
              <Route
                path={routes.PROJECTS_FEEDBACKNEHMER}
                exact
                component={props => <Clients {...props} />}
              />
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Project;

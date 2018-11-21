import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Route, NavLink } from 'react-router-dom';
import { Grid, Menu, Divider } from 'semantic-ui-react';
import withAuthorization from 'components/withAuthorization';
import AdminDataContext from 'components/AdminDataContext';

import * as routes from 'constants/routes';
import Language from 'components/Language';

import Questions from './Questions';
import Clients from './Clients';
import ClientDetails from './ClientDetails';
import Feedbackers from './Feedbackers/Feedbackers';
import FeedbackerDetail from './Feedbackers/FeedbackerDetail';
import Analysis from './Analysis';

import { db } from '../../firebase';

class Project extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      params: this.props.match.params,
      adminData: null,
    };
  }

  componentDidMount = () => {
    const { projectId } = this.state.params;
    db.onceGetRoles().then((snapshot) => {
      this.setState(() => ({
        adminData: {
          ...this.state.adminData,
          roles: (snapshot.val()) ? snapshot.val() : {},
        },
      }));
    });
    db.onceGetContexts().then((snapshot) => {
      this.setState(() => ({
        adminData: {
          ...this.state.adminData,
          contexts: (snapshot.val()) ? snapshot.val() : {},
        },
      }));
    });
    db.getProject(projectId).on('value', (snapshot) => {
      this.setState(() => ({
        adminData: {
          ...this.state.adminData,
          project: (snapshot.val()) ? snapshot.val() : {},
        },
      }));
    });
  }

  render() {
    const { projectId } = this.state.params;
    const { adminData } = this.state;
    return (
      <AdminDataContext.Provider value={adminData}>
        <div className="admin-content">
          <Language languages={{ en: 'true' }} />
          <Divider clearing hidden />
          <Grid>
            <Grid.Column width={3}>
              &nbsp;
            </Grid.Column>
            <Grid.Column width={13}>
              { (adminData && adminData.project && adminData.project.name)
              && <h4>Projekt: {adminData.project.name}</h4>
              }
              <hr />
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column width={3}>
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
            <Grid.Column stretched width={13}>
              <Route
                path={routes.PROJECT}
                exact
                component={Questions}
              />
              <Route
                path={routes.PROJECT_FRAGEN}
                exact
                component={Questions}
              />
              <Route
                path={routes.PROJECT_ANALYSE}
                exact
                component={Analysis}
              />
              <Route
                path={routes.PROJECT_FEEDBACKGEBER}
                exact
                component={Feedbackers}
              />
              <Route
                path={routes.PROJECT_FEEDBACKGEBER_DETAILS}
                exact
                component={FeedbackerDetail}
              />
              <Route
                path={routes.PROJECT_FEEDBACKNEHMER}
                exact
                component={Clients}
              />
              <Route
                path={routes.PROJECT_FEEDBACKNEHMER_DETAILS}
                exact
                component={ClientDetails}
              />
            </Grid.Column>
          </Grid>
        </div>
      </AdminDataContext.Provider>
    );
  }
}

const authCondition = (authUser, admin) => (!!authUser && admin);
export default withAuthorization(authCondition)(Project);

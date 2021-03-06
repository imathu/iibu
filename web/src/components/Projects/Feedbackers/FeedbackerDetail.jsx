import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Form, Input, Button, Grid, Select, Header, Container } from 'semantic-ui-react';
import AdminDataContext from 'components/AdminDataContext';

import FeedbackerClientList from './FeedbackerClientList';

import { db } from '../../../firebase';

const byPropKey = (data, propertyName, value) => () => ({
  data: {
    ...data,
    [propertyName]: value,
  },
  changedData: true,
});

const options = [
  { key: 'm', text: 'Männlich', value: 'm' },
  { key: 'w', text: 'Weiblich', value: 'w' },
];

class FeedbackerDetail extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({}),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
        feedbackerId: PropTypes.string,
      }),
    }).isRequired,
  }
  state = {
    data: {},
    selectedClients: {},
    changedData: false,
  }
  componentDidMount = () => {
    const data = this.props.location.state;
    const { projectId, feedbackerId } = this.props.match.params;
    if (!data) {
      db.onceGetFeedbacker(projectId, feedbackerId).then((snapshot) => {
        this.setState(() => ({
          data: snapshot.val(),
          selectedClients: (data.clients) || {},
        }));
      });
    } else {
      this.setState(() => ({
        data,
        selectedClients: data.clients || {},
      }));
    }
  }
  onFeedbackerSave = () => {
    const { projectId } = this.props.match.params;
    db.doUpdateFeedbacker(projectId, this.state.data).then(() =>
      this.setState(() => ({ changedData: false })));
  }
  setRole = (clientId, roleId) => {
    const { data } = this.state;
    if (data.clients[clientId]) {
      data.clients[clientId].role = roleId;
      this.setState(() => ({
        data,
        selectedClients: data.clients,
        changedData: true,
      }));
    }
  }
  toggleClient = (clientId, roleId) => {
    const { data } = this.state;
    let clients = {};
    if (!data.clients[clientId]) {
      clients = Object.assign({}, data.clients, {
        ...data.clients,
        [clientId]: {
          id: clientId,
          role: roleId,
          answers: {},
        },
      });
    } else {
      delete data.clients[clientId];
      clients = data.clients; // eslint-disable-line
    }
    data.clients = clients;
    this.setState(() => ({
      data,
      selectedClients: data.clients,
      changedData: true,
    }));
  }
  render() {
    const { data, changedData, selectedClients } = this.state;
    const {
      id,
      email,
      gender,
    } = data;
    const { projectId } = this.props.match.params;
    return (
      <div>
        <Header as="h1">Feedbackgeber Details</Header>
        {(data.id)
          ?
            <Container>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={12}>
                    <Segment>
                      <Form>
                        <b>Id:</b> {id}
                        <br />
                        <br />
                        <Form.Field
                          fluid
                          control={Input}
                          width={8}
                          label="E-Mail"
                          placeholder="mail Addresse"
                          value={email}
                          onChange={(event, d) => this.setState(byPropKey(data, 'email', d.value))}
                        />
                        <Form.Field
                          fluid
                          control={Select}
                          width={8}
                          label="Geschlecht"
                          options={options}
                          value={gender}
                          onChange={(event, d) => this.setState(byPropKey(data, 'gender', d.value))}
                        />
                        <AdminDataContext.Consumer>
                          {adminData => (adminData
                          ?
                            <FeedbackerClientList
                              projectId={projectId}
                              adminData={adminData}
                              selectedClients={selectedClients}
                              toggleClient={this.toggleClient}
                              setRole={this.setRole}
                            />
                            : null
                          )}
                        </AdminDataContext.Consumer>
                      </Form>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Button
                      onClick={this.onFeedbackerSave}
                      positive
                      icon="checkmark"
                      labelPosition="right"
                      content="Speichern"
                      disabled={(!changedData || Object.keys(selectedClients).length <= 0)}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          :
            <Segment>loading...</Segment>
        }
      </div>
    );
  }
}

export default FeedbackerDetail;

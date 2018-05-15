import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Form, Input, Button, Grid, Select } from 'semantic-ui-react';

import { db } from '../../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  changedData: true,
});

const options = [
  { key: 'm', text: 'Männlich', value: 'm' },
  { key: 'w', text: 'Weiblich', value: 'w' },
];

class ClientDetail extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      name: PropTypes.string,
      firstname: PropTypes.string,
      email: PropTypes.string,
      gender: PropTypes.string,
      id: PropTypes.string,
    }).isRequired,
    projectId: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.client.name,
      firstname: this.props.client.firstname,
      email: this.props.client.email,
      gender: this.props.client.gender,
      changedData: false,
    };
  }
  onClientSave = () => {
    const { id } = this.props.client;
    const client = {
      name: this.state.name,
      firstname: this.state.firstname,
      email: this.state.email,
      gender: this.state.gender,
      id,
    };
    db.doSaveClient(this.props.projectId, client).then(() =>
      this.setState(() => ({ changedData: false })));
  }
  render() {
    const {
      name,
      firstname,
      gender,
      email,
      changedData,
    } = this.state;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Segment>
                <Form>
                  <Form.Group>
                    <Form.Field
                      id="name"
                      control={Input}
                      label="Name"
                      placeholder="Name"
                      width={8}
                      value={name}
                      onChange={event => this.setState(byPropKey('name', event.target.value))}
                    />
                    <Form.Field
                      id="firstname"
                      control={Input}
                      label="Vorname"
                      placeholder="Vorname"
                      width={8}
                      value={firstname}
                      onChange={event => this.setState(byPropKey('firstname', event.target.value))}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Field
                      id="mail"
                      control={Input}
                      label="Mail"
                      placeholder="Mail"
                      width={12}
                      value={email}
                      onChange={event => this.setState(byPropKey('email', event.target.value))}
                    />
                    <Form.Field
                      fluid
                      control={Select}
                      width={4}
                      label="Geschlecht"
                      options={options}
                      value={gender}
                      onChange={(event, data) => this.setState(byPropKey('gender', data.value))}
                    />
                  </Form.Group>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.onClientSave}
                positive
                icon="checkmark"
                labelPosition="right"
                content="Speichern"
                disabled={!changedData}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ClientDetail;

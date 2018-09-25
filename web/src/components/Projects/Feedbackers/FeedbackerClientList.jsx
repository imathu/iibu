import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Table, Radio, Dropdown } from 'semantic-ui-react';

import { db } from '../../../firebase';

class FeedbackerClientList extends React.Component {
  state = {
    clients: [],
    options: Object.keys(this.props.adminData.roles).map(id => ({
      key: id,
      value: id,
      text: this.props.adminData.roles[id].de || 'n/a',
    })),
  }
  componentDidMount = () => {
    const { projectId } = this.props;
    db.onceGetClients(projectId).then((snapshot) => {
      const clients = snapshot.val();
      this.setState(() => ({
        clients: Object.keys(clients).map(id => ({
          id,
          name: clients[id].name,
          firstname: clients[id].firstname,
        })),
      }));
    });
  }
  setRole = (clientId, roleId) => {
    this.props.setRole(clientId, roleId);
  }
  toggleClient = (clientId) => {
    this.props.toggleClient(clientId, 'kollege');
  }
  render() {
    const { selectedClients } = this.props;
    const { clients, options } = this.state;
    return (
      <div>
        <hr />
        <Header>Clients</Header>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Vorname</Table.HeaderCell>
              <Table.HeaderCell>Rolle</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {clients.map(client => (
              <Table.Row key={client.id}>
                <Table.Cell>
                  {client.id}
                </Table.Cell>
                <Table.Cell>
                  {client.firstname}
                </Table.Cell>
                <Table.Cell>
                  {selectedClients[client.id] && (
                    <Dropdown
                      placeholder="Rolle"
                      options={options}
                      value={selectedClients[client.id].role}
                      onChange={(event, data) => this.setRole(client.id, data.value)}
                    />
                  )
                  }
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    toggle
                    checked={!!selectedClients[client.id]}
                    onChange={() => this.toggleClient(client.id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
FeedbackerClientList.propTypes = {
  projectId: PropTypes.string.isRequired,
  selectedClients: PropTypes.shape({}).isRequired,
  adminData: PropTypes.shape({
    roles: PropTypes.shape({}),
  }).isRequired,
  toggleClient: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
};

export default FeedbackerClientList;

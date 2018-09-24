import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Table, Radio, Dropdown } from 'semantic-ui-react';

import { db } from '../../../firebase';

class FeedbackerClientList extends React.Component {
  state = {
    clients: [],
    options: Object.keys(this.props.adminData.roles).map(id => ({
      key: this.props.adminData.roles[id],
      value: this.props.adminData.roles[id],
      text: 'Rolle',
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
  render() {
    const { selectedClients } = this.props;
    const selectedClientIds = Object.keys(selectedClients);
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
                  <Dropdown
                    placeholder="Rolle"
                    options={options}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Radio
                    toggle
                    checked={client.id.indexOf(selectedClientIds) !== -1}
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
};

export default FeedbackerClientList;

import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, Button } from 'semantic-ui-react';

const ClientList = ({
  clients,
  editedData,
  onClientsSave,
  projectId,
}) => (
  <div>
    {editedData &&
      <Button
        color="green"
        onClick={() => onClientsSave()}
      >Daten speichern
      </Button>
    }
    {Object.keys(clients).lenght > 0}
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Vorname</Table.HeaderCell>
          <Table.HeaderCell>Mail</Table.HeaderCell>
          <Table.HeaderCell>Geschlecht</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!clients && Object.keys(clients).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{clients[id].name}</Table.Cell>
            <Table.Cell>{clients[id].firstname}</Table.Cell>
            <Table.Cell>{clients[id].email}</Table.Cell>
            <Table.Cell>{clients[id].gender}</Table.Cell>
            <Table.Cell>
              <a href={`/project/${projectId}/feedbacknehmer/${id}`}>details</a>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
ClientList.propTypes = {
  clients: PropTypes.shape({}).isRequired,
  editedData: PropTypes.bool.isRequired,
  onClientsSave: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default ClientList;

import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table } from 'semantic-ui-react';

import { db } from '../../firebase';

const Clients = props => (
  <div>
    <h1>Clients</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Vorname</Table.HeaderCell>
          <Table.HeaderCell>Mail</Table.HeaderCell>
          <Table.HeaderCell>Geschlecht</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{props.data[id].name}</Table.Cell>
            <Table.Cell>{props.data[id].firstname}</Table.Cell>
            <Table.Cell>{props.data[id].email}</Table.Cell>
            <Table.Cell>{props.data[id].gender}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Clients.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetClients;

export default withLoader(dbFunction, 'projectId')(Clients);

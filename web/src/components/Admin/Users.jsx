import React from 'react';
import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import { db } from '../../firebase';

const Users = ({ data }) => (
  <div>
    <h1>Users</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Id</Table.HeaderCell>
          <Table.HeaderCell>Mail</Table.HeaderCell>
          <Table.HeaderCell>Benutzername</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!data && Object.keys(data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{data[id].email}</Table.Cell>
            <Table.Cell>{data[id].username}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Users.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetUsers;
export default withLoader(dbFunction)(Users);

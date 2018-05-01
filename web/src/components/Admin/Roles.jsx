import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, List } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import { db } from '../../firebase';

const Roles = props => (
  <div>
    <h1>Rollen</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Id</Table.HeaderCell>
          <Table.HeaderCell>Beschreibung</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>
              <List>
                {Object.keys(props.data[id]).map(d => (
                  <List.Item key={props.data[id][d]}>{d}: {props.data[id][d]}</List.Item>
                ))}
              </List>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Roles.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetRoles;

export default withLoader(dbFunction)(Roles);

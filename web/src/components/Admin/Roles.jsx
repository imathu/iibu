import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, List } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import { getRoleById } from 'utils/roles';

import { db } from '../../firebase';

const Roles = (props) => {
  const { data } = props;
  return (
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
                  <List.Item key={getRoleById(data, id, 'de')}>{'de'}: {getRoleById(data, id, 'de')}</List.Item>
                  <List.Item key={getRoleById(data, id, 'en')}>{'en'}: {getRoleById(data, id, 'en')}</List.Item>
                </List>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
Roles.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetRoles;

export default withLoader(dbFunction)(Roles);

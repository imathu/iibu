import React from 'react';
import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import { db } from '../../firebase';

const Templates = props => (
  <div>
    <h1>Templates</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Id</Table.HeaderCell>
          <Table.HeaderCell>Titel</Table.HeaderCell>
          <Table.HeaderCell>Beschreibung</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{props.data[id].title}</Table.Cell>
            <Table.Cell>{props.data[id].description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Templates.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetTemplates;

export default withLoader(dbFunction)(Templates);

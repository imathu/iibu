import React from 'react';
import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';
import withLoader from 'components/withLoader';

import { db } from '../../firebase';

const Projects = props => (
  <div className="admin-content">
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Projekt</Table.HeaderCell>
          <Table.HeaderCell>Id</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{props.data[id].name}</Table.Cell>
            <Table.Cell>
              <a href={`/project/${id}/fragen`}>{id}</a>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Projects.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetProjects;

export default withLoader(dbFunction)(Projects);

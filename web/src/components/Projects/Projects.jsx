import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import withLoader from 'components/withLoader';
import withAuthorization from 'components/withAuthorization';

import { db } from '../../firebase';

const Projects = props => (
  <div className="admin-content" style={{ width: '60%' }}>
    <Button as={Link} to="projects/edit">Neues Projekt</Button>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Projekt</Table.HeaderCell>
          <Table.HeaderCell />
          <Table.HeaderCell />
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{props.data[id].name}</Table.Cell>
            <Table.Cell>
              <a href={`/project/${id}/fragen`}>Analyse</a>
            </Table.Cell>
            <Table.Cell>
              <a href={`/projects/edit?projectId=${id}`}>Details</a>
            </Table.Cell>
            <Table.Cell>
              <Button size="tiny">Löschen</Button>
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

const authCondition = (authUser, admin) => (!!authUser && admin);
export default withAuthorization(authCondition)(withLoader(dbFunction)(Projects));

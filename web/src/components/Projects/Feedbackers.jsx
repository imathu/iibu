import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table } from 'semantic-ui-react';

import { db } from '../../firebase';

const Feedbackers = props => (
  <div>
    <h1>Feedbackgeber</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Mail</Table.HeaderCell>
          <Table.HeaderCell>Geschlecht</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{props.data[id].email}</Table.Cell>
            <Table.Cell>{props.data[id].gender}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Feedbackers.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetFeedbackers;

export default withLoader(dbFunction, 'projectId')(Feedbackers);

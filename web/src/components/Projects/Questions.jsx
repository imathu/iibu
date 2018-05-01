import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table, List } from 'semantic-ui-react';

import { db } from '../../firebase';

const Questions = props => (
  <div>
    <h1>Fragebogen</h1>
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Id</Table.HeaderCell>
          <Table.HeaderCell>Thema</Table.HeaderCell>
          <Table.HeaderCell>Skore</Table.HeaderCell>
          <Table.HeaderCell>Formulierung</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!props.data && Object.keys(props.data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{props.data[id].context}</Table.Cell>
            <Table.Cell>{props.data[id].scores}</Table.Cell>
            <Table.Cell>
              <List>
                <List.Item key={props.data[id].de.he}>de: {props.data[id].de.he}</List.Item>
                <List.Item key={props.data[id].en.he}>en: {props.data[id].en.he}</List.Item>
              </List>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);
Questions.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

const dbFunction = db.onceGetQuestions;
export default withLoader(dbFunction, 'projectId')(Questions);

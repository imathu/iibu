import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table, List } from 'semantic-ui-react';

import { db } from '../../firebase';

const Questions = ({ data }) => (
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
        {!!data && Object.keys(data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{data[id].context}</Table.Cell>
            <Table.Cell>{data[id].scores}</Table.Cell>
            <Table.Cell>
              <List>
                <List.Item key={data[id].de.he}>de: {data[id].de.he}</List.Item>
                <List.Item key={data[id].en.he}>en: {data[id].en.he}</List.Item>
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

// export default Questions;

const dbFunction = db.onceGetQuestions;
export default withLoader(dbFunction, 'projectId')(Questions);

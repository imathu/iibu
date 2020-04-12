import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, List } from 'semantic-ui-react';

import { getContextById } from 'utils/context';
import { getQuestionContent } from 'utils/question';

const QuestionList = (props) => {
  const { data, adminData } = props;
  return (
    <Table celled padded size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Id #</Table.HeaderCell>
          <Table.HeaderCell>Thema</Table.HeaderCell>
          <Table.HeaderCell>Skore</Table.HeaderCell>
          <Table.HeaderCell>Formulierung</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {!!data && Object.keys(data).map(id => (
          <Table.Row key={id}>
            <Table.Cell>{id}</Table.Cell>
            <Table.Cell>{getContextById(adminData.contexts, data[id].context)}</Table.Cell>
            <Table.Cell>{data[id].scores}</Table.Cell>
            <Table.Cell>
              <List>
                <List.Item
                  key={`${id}+1`}
                >
                  he: {getQuestionContent(data[id], 'he')}
                </List.Item>
                <List.Item
                  key={`${id}+2`}
                >she: {getQuestionContent(data[id], 'she')}
                </List.Item>
                <List.Item
                  key={`${id}+3`}
                >me: {getQuestionContent(data[id], 'me')}
                </List.Item>
              </List>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
QuestionList.propTypes = {
  data: PropTypes.shape({}).isRequired,
  adminData: PropTypes.shape({}).isRequired,
};

export default QuestionList;

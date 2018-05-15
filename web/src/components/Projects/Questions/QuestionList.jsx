import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, List } from 'semantic-ui-react';


const QuestionList = (props) => {
  const { data } = props;
  return (
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
                <List.Item
                  key={data[id].content.de.he}
                >
                  de: {data[id].content.de.he}
                </List.Item>
                <List.Item
                  key={data[id].content.en.he}
                >en: {data[id].content.en.he}
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
};

export default QuestionList;

import React from 'react';
import { PropTypes } from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import { getContextById } from 'utils/context';
import { getQuestionContent } from 'utils/question';
import { getLanguage } from '../../../utils/language';

const QuestionList = (props) => {
  const { data, adminData, newContexts } = props;
  const { contexts } = adminData;
  return (
    <React.Fragment key="overall">
      {newContexts.length > 0 && (
        <React.Fragment key="contexts">
          <h2>Neue Contexte</h2>
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Deutsch</Table.HeaderCell>
                <Table.HeaderCell>Englisch</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!!newContexts && newContexts.map(currentContext => currentContext.id && (
                <Table.Row key={`context_${currentContext.id}`}>
                  <Table.Cell>
                    {currentContext.id}
                  </Table.Cell>
                  <Table.Cell>
                    {currentContext.de}
                  </Table.Cell>
                  <Table.Cell>
                    {currentContext.en}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <h2>Neue Fragen</h2>
        </React.Fragment>
      )}
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
              <Table.Cell>{
                getContextById(contexts, data[id].context, getLanguage(), true)
              }
              </Table.Cell>
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
    </React.Fragment>
  );
};
QuestionList.propTypes = {
  data: PropTypes.shape({}).isRequired,
  adminData: PropTypes.shape({ contexts: PropTypes.shape({}) }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  newContexts: PropTypes.array,
};

QuestionList.defaultProps = {
  newContexts: [],
};

export default QuestionList;

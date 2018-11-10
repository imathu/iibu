import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Segment, Header, Divider, Table } from 'semantic-ui-react';
import { getRoleContent, getRolePhraseStart, getRoleCode } from 'utils';

import LanguageContext from 'components/LanguageContext';
import MatchText from './MatchText';

import Question from './Question';
import Answer from './Answer';

const Client = (props) => {
  const {
    client,
    feedbacker,
    questions,
    roles,
    projectId,
  } = props;
  const roleId = feedbacker.clients[client.id].role;
  const roleContent = getRoleContent(roles, roleId);
  const rolePhrase = getRolePhraseStart(roles, roleId, getRoleCode((roleId === 'self') ? 'self' : feedbacker.gender));
  return (
    <Segment>
      <Header textAlign="left" as="h2" >
        <FormattedMessage
          id={(client.gender === 'w') ? 'feedback.feedbackerin' : 'feedback.feedbacker'}
          defaultMessage="Feedbacknehmer"
          values={{ what: 'react-intl' }}
        />
        : {client.name} {client.firstname}
      </Header>
      <FormattedMessage
        id="feedback.role"
        defaultMessage="Sie geben Feedback in der Rolle als"
        values={{ what: 'react-intl' }}
      />
      : {roleContent}
      <Divider />
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Id
            </Table.HeaderCell>
            <Table.HeaderCell>
              {rolePhrase}
            </Table.HeaderCell>
            <Table.HeaderCell>
              <MatchText />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(questions).map((id, idx) => (
            <Table.Row key={id}>
              <Table.Cell>
                {idx}
              </Table.Cell>
              <Table.Cell>
                <LanguageContext.Consumer>
                  {language => (
                    <Question
                      question={questions[id]}
                      roleId={roleId}
                      gender={feedbacker.gender}
                      language={language}
                    />
                  )}
                </LanguageContext.Consumer>
              </Table.Cell>
              <Table.Cell collapsing>
                <Answer
                  feedbacker={feedbacker}
                  scores={questions[id].scores}
                  projectId={projectId}
                  clientId={client.id}
                  questionId={id}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
};
Client.propTypes = {
  questions: PropTypes.shape({}).isRequired,
  client: PropTypes.shape({}).isRequired,
  feedbacker: PropTypes.shape({}).isRequired,
  roles: PropTypes.shape({}).isRequired,
  projectId: PropTypes.string.isRequired,
};

export default Client;

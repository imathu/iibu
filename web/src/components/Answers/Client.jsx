import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Segment, Header, Divider, Table } from 'semantic-ui-react';
import { getRoleContent } from 'utils';

import LanguageContext from 'components/LanguageContext';

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
  return (
    <Segment>
      <Header textAlign="left" as="h2" >
        <FormattedMessage
          id="feedback.feedbacker"
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
              <FormattedMessage
                id="feedback.question"
                defaultMessage="Frage"
                values={{ what: 'react-intl' }}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              1 = <FormattedMessage
                id="feedback.nomatch"
                defaultMessage="trifft nicht zu"
                values={{ what: 'react-intl' }}
              />
              <br />
              5 = <FormattedMessage
                id="feedback.match"
                defaultMessage="trifft zu"
                values={{ what: 'react-intl' }}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(questions).map(id => (
            <Table.Row key={id}>
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

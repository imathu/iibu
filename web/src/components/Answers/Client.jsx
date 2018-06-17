import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Divider, Table } from 'semantic-ui-react';
import { getRoleContent } from 'utils';

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
      <Header textAlign="left" as="h2" >Feedbacknehmer: {client.name} {client.firstname}</Header>
      Sie geben Feedback in der Rolle als: {roleContent}
      <Divider />
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Frage</Table.HeaderCell>
            <Table.HeaderCell>1 = trifft nicht zu<br />5 = trifft zu</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(questions).map(id => (
            <Table.Row key={id}>
              <Table.Cell>
                <Question
                  question={questions[id]}
                  roleId={roleId}
                  gender={feedbacker.gender}
                />
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

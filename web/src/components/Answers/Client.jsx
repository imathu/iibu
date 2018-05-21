import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Divider, Table } from 'semantic-ui-react';

import Question from './Question';
import Answer from './Answer';

const Client = (props) => {
  const { client, feedbacker, questions } = props;
  return (
    <Segment>
      <Header textAlign="left" as="h2" >Feedbacknemer: {client.name} {client.firstname}</Header>
      Sie geben Feedback in der Rolle als: {feedbacker.clients[client.id].role}
      <Divider />
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Frage</Table.HeaderCell>
            <Table.HeaderCell>Antwort</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.keys(questions).map(id => (
            <Table.Row key={id}>
              <Table.Cell>
                <Question
                  question={questions[id]}
                />
              </Table.Cell>
              <Table.Cell collapsing>
                <Answer
                  feedbacker={feedbacker}
                  scores={questions[id].scores}
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
};

export default Client;

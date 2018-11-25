import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Segment, Header, Divider, Table } from 'semantic-ui-react';
import { getRoleContent, getRolePhraseStart, getRoleCode } from 'utils';

import MatchText from './MatchText';
import ClientRow from './ClientRow';

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
  const rolePhrase = getRolePhraseStart(roles, roleId, getRoleCode(roleId, client.gender));
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
            <ClientRow
              key={id}
              idx={idx}
              id={id}
              feedbacker={feedbacker}
              questions={questions}
              projectId={projectId}
              client={client}
              roleId={roleId}
            />
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

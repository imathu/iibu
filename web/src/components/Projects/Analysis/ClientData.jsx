import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Table } from 'semantic-ui-react';

import { getAllContextIds } from 'utils/question';

import ClientContextBar from './ClientContextBar';
import ClientContextRadar from './ClientContextRadar';

const ClientData = props => (
  <React.Fragment>
    {props.bar && (
      <Segment>
        <Table>
          <Table.Body>
            {getAllContextIds(props.data.questions).map(contextId => (
              <ClientContextBar
                {...props}
                key={contextId}
                contextId={contextId}
              />
            ))}
          </Table.Body>
        </Table>
      </Segment>
    )}
    {props.radar && (
      <Segment>
        <Table>
          <Table.Body>
            <ClientContextRadar
              {...props}
            />
          </Table.Body>
        </Table>
      </Segment>
    )}
  </React.Fragment>
);
ClientData.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({}),
  }).isRequired,
  adminData: PropTypes.shape({
    contexts: PropTypes.shape({}),
  }).isRequired,
  radar: PropTypes.bool.isRequired,
  bar: PropTypes.bool.isRequired,
  clientId: PropTypes.string.isRequired,
};

export default ClientData;

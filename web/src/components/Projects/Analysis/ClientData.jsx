import React from 'react';
import { Segment } from 'semantic-ui-react';

import { getAllContextIds } from 'utils/question';
import { getContextById } from 'utils/context';

const ClientData = ({ data, adminData, clientId }) => {
  console.log(data, clientId);
  return (
    <Segment>
      {getAllContextIds(data.questions).map(contextId => (
        <div>
          {getContextById(adminData.contexts, contextId)}
          <br />
        </div>
      ))}
    </Segment>
  );
};

export default ClientData;

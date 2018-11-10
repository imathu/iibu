import React from 'react';
import { FormattedMessage } from 'react-intl';

const MatchText = () => (
  <div>
    0 = <FormattedMessage
      id="feedback.neutralMatch"
      defaultMessage="kann nicht beurteilt werden"
      values={{ what: 'react-intl' }}
    />
    <br />
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
  </div>
);

export default MatchText;

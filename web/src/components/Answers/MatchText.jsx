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
      id="feedback.match1"
      defaultMessage="trifft nicht zu"
      values={{ what: 'react-intl' }}
    />
    <br />
    2 = <FormattedMessage
      id="feedback.match2"
      defaultMessage="trifft eher nicht zu"
      values={{ what: 'react-intl' }}
    />
    <br />
    3 = <FormattedMessage
      id="feedback.match3"
      defaultMessage="teils teils"
      values={{ what: 'react-intl' }}
    />
    <br />
    4 = <FormattedMessage
      id="feedback.match4"
      defaultMessage="trifft eher zu"
      values={{ what: 'react-intl' }}
    />
    <br />
    5 = <FormattedMessage
      id="feedback.match5"
      defaultMessage="trifft zu"
      values={{ what: 'react-intl' }}
    />
  </div>
);

export default MatchText;

import React from 'react';
import { FormattedMessage } from 'react-intl';

const LandingPage = () => (
  <div style={{ textAlign: 'center' }}>
    <br />
    <h1>
      <FormattedMessage
        id="app.title"
        defaultMessage="Willkommen bei iibu"
        values={{ what: 'react-intl' }}
      />
    </h1>
    <FormattedMessage
      id="app.intro"
      defaultMessage="270 Grad Feedbackanalyse für Führungskräfte"
      values={{ what: 'react-intl' }}
    />
  </div>
);

export default LandingPage;

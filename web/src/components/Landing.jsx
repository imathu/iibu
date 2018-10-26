import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container, Header } from 'semantic-ui-react';

const LandingPage = ({ mobile }) => (
  <div>
    <Container text>
      <Header
        as="h1"
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: mobile ? '1.5em' : '3em',
          textAlign: 'center',
        }}
      >
        <FormattedMessage
          id="app.title"
          defaultMessage="Willkommen bei realfeedback.ch"
          values={{ what: 'react-intl' }}
        />
      </Header>
      <Header
        as="h2"
        style={{
          fontSize: mobile ? '1.5em' : '1.7em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.5em' : '1.5em',
          textAlign: 'center',
        }}
      >
        <FormattedMessage
          id="app.intro"
          defaultMessage="360 Grad Feedbackanalyse für Führungskräfte"
          values={{ what: 'react-intl' }}
        />
      </Header>
    </Container>
  </div>
);
LandingPage.propTypes = {
  mobile: PropTypes.bool,
};
LandingPage.defaultProps = {
  mobile: false,
};

export default LandingPage;

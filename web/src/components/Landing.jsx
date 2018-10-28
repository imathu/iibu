import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container, Header } from 'semantic-ui-react';

import AuthUserContext from 'components/AuthUserContext';

const LandingPage = ({ mobile }) => (
  <AuthUserContext.Consumer>
    {auth => (!auth
      ?
        <div>
          <Container text textAlign="center">
            <Header
              as="h1"
              style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: mobile ? '1em' : '1em',
                textAlign: 'center',
              }}
            >
              <FormattedMessage
                id="app.title"
                defaultMessage="realfeedback.ch"
                values={{ what: 'react-intl' }}
              />
            </Header>
            <Header
              as="h2"
              style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.1em' : '1em',
                textAlign: 'center',
              }}
            >
              <FormattedMessage
                id="app.intro"
                defaultMessage="professionelle 360 Grad Feedbackanalyse für Führungskräfte"
                values={{ what: 'react-intl' }}
              />
            </Header>
            <FormattedMessage
              id="app.contact"
              defaultMessage="kontaktiere info at realfeedback.ch"
              values={{ what: 'react-intl' }}
            />
          </Container>
        </div>
        :
        <Container
          style={{
            width: mobile ? '80%' : '40%',
          }}
          text
          textAlign="center"
        >
          <Header
            as="h1"
            style={{ marginTop: mobile ? '0.1em' : '3em' }}
          >
            <FormattedMessage
              id="app.loginMessage"
              defaultMessage="Willkommen"
              values={{ what: 'react-intl' }}
            />
            <i> {auth.authUser.email} </i>
          </Header>
          <Header as="h2">
            <FormattedMessage
              id="app.feedbackerThanks"
              defaultMessage="Danke dass du bei realfeedback.ch mitmachst"
              values={{ what: 'react-intl' }}
            />
          </Header>
          <br /><hr /><br />
          <FormattedMessage
            id="app.feedbackerMessage"
            defaultMessage="Für die Teilnahme an einer Feedbackrunde erhälst du von deinem Organisator einen Link per Mail"
            values={{ what: 'react-intl' }}
          />
        </Container>
    )}
  </AuthUserContext.Consumer>
);
LandingPage.propTypes = {
  mobile: PropTypes.bool,
};
LandingPage.defaultProps = {
  mobile: false,
};

export default LandingPage;

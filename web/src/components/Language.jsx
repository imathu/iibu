import React from 'react';
import { Flag, Container } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import { LANGUAGE } from 'utils/language';

const Language = () => (
  <LanguageContext.Consumer>
    {language => (
      <Container textAlign="right">
        <Flag name="de" onClick={() => language.setLanguage(LANGUAGE.DE)} />
        <Flag name="gb" onClick={() => language.setLanguage(LANGUAGE.EN)} />
      </Container>
    )}
  </LanguageContext.Consumer>
);

export default Language;

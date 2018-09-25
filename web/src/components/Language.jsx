import React from 'react';
import { PropTypes } from 'prop-types';
import { Flag, Container } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import { LANGUAGE } from 'utils/language';

const Content = ({ language, languages }) => (
  <Container textAlign="right">
    <Flag name="de" onClick={() => language.setLanguage(LANGUAGE.DE)} />
    {languages && languages.en && (
      <Flag name="gb" onClick={() => language.setLanguage(LANGUAGE.EN)} />
    )}
  </Container>
);
Content.propTypes = {
  languages: PropTypes.shape({}),
  language: PropTypes.shape({}).isRequired,
};
Content.defaultProps = {
  languages: null,
};

const Language = ({ language, languages }) => {
  if (language) {
    return <Content language={language} languages={languages} />;
  }
  return (
    <LanguageContext.Consumer>
      {l => (
        <Content language={l} languages={languages} />
      )}
    </LanguageContext.Consumer>
  );
};
Language.propTypes = {
  languages: PropTypes.shape({}),
  language: PropTypes.shape({}),
};
Language.defaultProps = {
  languages: null,
  language: null,
};

export default Language;

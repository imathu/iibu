import React from 'react';
import { PropTypes } from 'prop-types';
import { Flag, Container } from 'semantic-ui-react';
import { LANGUAGE } from 'utils/language';

class Language extends React.Component {
  static propTypes = {
    language: PropTypes.shape({
      setLanguage: PropTypes.func,
    }).isRequired,
  }
  setLanguage = (language) => {
    this.props.language.setLanguage(language);
  }

  render() {
    return (
      <Container textAlign="right">
        <Flag name="de" onClick={() => this.setLanguage(LANGUAGE.DE)} />
        <Flag name="gb" onClick={() => this.setLanguage(LANGUAGE.EN)} />
      </Container>
    );
  }
}

export default Language;

import React from 'react';
import withAuthentication from 'components/withAuthentication';

import Content from 'components/Content';

import LanguageContext from 'components/LanguageContext';
import { getLanguage, setLanguage } from 'utils/language';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: getLanguage(),
    };
  }
  setLanguage = (language) => {
    this.setState(() => ({ language }));
    setLanguage(language);
  }
  render() {
    return (
      <LanguageContext.Provider
        value={{ language: this.state.language, setLanguage: this.setLanguage }}
      >
        <Content />
      </LanguageContext.Provider>
    );
  }
}

export default withAuthentication(App);

import React from 'react';
import withAuthentication from 'components/withAuthentication';

import { addLocaleData, IntlProvider } from 'react-intl';
import locale_en from 'react-intl/locale-data/en'; // eslint-disable-line camelcase
import locale_de from 'react-intl/locale-data/de'; // eslint-disable-line camelcase
import messages_de from 'translations/de.json'; // eslint-disable-line camelcase
import messages_en from 'translations/en.json'; // eslint-disable-line camelcase

import Content from 'components/Content';

import LanguageContext from 'components/LanguageContext';
import { getLanguage, setLanguage } from 'utils/language';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

addLocaleData([...locale_en, ...locale_de]); // eslint-disable-line camelcase

const messages = {
  de: messages_de,
  en: messages_en,
};

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
      <IntlProvider locale={this.state.language} messages={messages[this.state.language]}>
        <LanguageContext.Provider
          value={{ language: this.state.language, setLanguage: this.setLanguage }}
        >
          <Content />
        </LanguageContext.Provider>
      </IntlProvider>
    );
  }
}

export default withAuthentication(App);

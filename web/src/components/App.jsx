import React from 'react';
import withAuthentication from 'components/withAuthentication';
import {
  BrowserRouter as Router
}
from 'react-router-dom';


import {
  addLocaleData, IntlProvider
}
from 'react-intl';
import locale_en from 'react-intl/locale-data/en'; // eslint-disable-line camelcase
import locale_de from 'react-intl/locale-data/de'; // eslint-disable-line camelcase
import messages_de from 'translations/de.json'; // eslint-disable-line camelcase
import messages_en from 'translations/en.json'; // eslint-disable-line camelcase

import NavigationDesktop from 'components/Menu/NavigationDesktop';
import NavigationMobile from 'components/Menu/NavigationMobile';

import LanguageContext from 'components/LanguageContext';
import {
  getLanguage, setLanguage
}
from 'utils/language';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

addLocaleData([...locale_en, ...locale_de]); // eslint-disable-line camelcase

const messages = {
  de: messages_de,
  en: messages_en,
};

const PageContent = () => ( < React.Fragment >
  < NavigationDesktop / >
  < NavigationMobile / >
  < /React.Fragment>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: getLanguage(),
    };
  }
  setLanguage = (language) => {
    this.setState(() => ({
      language
    }));
    setLanguage(language);
  }
  render() {
    return ( < IntlProvider locale = {
        this.state.language
      }
      messages = {
        messages[this.state.language]
      } >
      < LanguageContext.Provider value = {
        {
          language: this.state.language,
          setLanguage: this.setLanguage
        }
      } >
      < Router >
      < PageContent / >
      < /Router> < /LanguageContext.Provider> < /IntlProvider>
    );
  }
}

export default withAuthentication(App);

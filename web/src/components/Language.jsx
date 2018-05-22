import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getLanguage, setLanguage } from 'utils/language';

const options = [
  { key: 1, text: 'de', value: 'de' },
  { key: 2, text: 'en', value: 'en' },
];

class Language extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'fr',
    };
  }

  componentDidMount = () => {
    this.setState(() => ({ language: getLanguage() }));
  }

  handleChange = (e, { value }) => {
    this.setState(() => ({ language: value }));
    setLanguage(value);
  }

  render() {
    const { language } = this.state;
    return (
      <Dropdown
        compact
        icon=""
        className="link item"
        onChange={this.handleChange}
        options={options}
        selection
        placeholder="de "
        value={language}
      />
    );
  }
}

export default Language;

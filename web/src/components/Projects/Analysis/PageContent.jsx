import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Select } from 'semantic-ui-react';

import ClientData from './ClientData';

const getOptions = (clients) => {
  if (!clients) return [];
  const clientIds = Object.keys(clients);
  return clientIds.map(id => ({
    key: id,
    value: id,
    text: `${clients[id].firstname} ${clients[id].name}`,
  }));
};

class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedClient: null,
    };
  }
  render() {
    const { selectedClient } = this.state;
    const { data } = this.props;
    return (
      <div>
        <Header floated="left" as="h1">Analyse</Header>
        <Select
          placeholder="Feedbacker"
          value={selectedClient}
          options={getOptions(data.clients)}
          onChange={(event, d) => this.setState(() => ({ selectedClient: d.value }))}
        />
        {(selectedClient) &&
          <ClientData {...this.props} clientId={selectedClient} />
        }
      </div>
    );
  }
}
PageContent.propTypes = {
  data: PropTypes.shape({}).isRequired,
  adminData: PropTypes.shape({}).isRequired,
};

export default PageContent;

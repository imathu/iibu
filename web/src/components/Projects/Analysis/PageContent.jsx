import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Select, Button } from 'semantic-ui-react';

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
      radar: true,
      bar: true,
    };
  }
  toggleRadar = () => {
    this.setState(() => ({ radar: !this.state.radar }));
  }
  toggleBar = () => {
    this.setState(() => ({ bar: !this.state.bar }));
  }
  render() {
    const { selectedClient, radar, bar } = this.state;
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
          <React.Fragment>
            <Button floated="right" positive>PDF</Button>
            <Button.Group floated="right" >
              <Button color={bar ? 'blue' : 'grey'} onClick={this.toggleBar}>BarChart</Button>
              <Button color={radar ? 'blue' : 'grey'} onClick={this.toggleRadar}>RadarChart</Button>
            </Button.Group>
            <ClientData
              {...this.props}
              clientId={selectedClient}
              radar={radar}
              bar={bar}
            />
          </React.Fragment>
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

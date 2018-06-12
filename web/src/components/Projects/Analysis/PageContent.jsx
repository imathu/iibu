import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Select, Button } from 'semantic-ui-react';

import { PDF } from 'utils/pdf';

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
      line: true,
    };
    this.ref = null;
  }
  toggleDiagramm = (dia) => {
    this.setState(() => ({ [dia]: !this.state[dia] }));
  }
  // generate a pdf, including all selected Chart types
  generatePDF = () => {
    const { bars, radar, lines } = this.ref;
    const clientId = this.state.selectedClient;
    const { clients } = this.props.data;
    const client = `${clients[clientId].firstname} ${clients[clientId].name}`;
    const pdf = new PDF(client, true, '', true);
    if (this.state.bar) {
      const barsArray = Object.keys(bars).map(key => (bars[key]));
      barsArray.forEach(chart => (
        pdf.addBarChart(chart.bar.getChart(), chart.state.context)
      ));
    }
    if (this.state.line) {
      const barsArray = Object.keys(lines).map(key => (lines[key]));
      barsArray.forEach(chart => (
        pdf.addBarChart(chart.bar.getChart(), chart.state.context)
      ));
    }
    if (this.state.radar) {
      pdf.addRadarChart(radar.radar.getChart());
    }
    pdf.save(`${client}.pdf`);
  }
  render() {
    const {
      selectedClient,
      radar,
      bar,
      line,
    } = this.state;
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
            <Button
              floated="right"
              positive
              onClick={this.generatePDF}
            >PDF
            </Button>
            <Button.Group floated="right" >
              <Button color={bar ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('bar')}>Bar</Button>
              <Button color={line ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('line')}>Line</Button>
              <Button color={radar ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('radar')}>Radar</Button>
            </Button.Group>
            <ClientData
              {...this.props}
              clientId={selectedClient}
              radar={radar}
              bar={bar}
              line={line}
              onRef={(ref) => { this.ref = ref; }}
            />
          </React.Fragment>
        }
      </div>
    );
  }
}
PageContent.propTypes = {
  data: PropTypes.shape({
    clients: PropTypes.shape({}),
  }).isRequired,
  adminData: PropTypes.shape({}).isRequired,
};

export default PageContent;

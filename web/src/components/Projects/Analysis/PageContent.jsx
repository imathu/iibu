import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Select, Button, Icon, Divider } from 'semantic-ui-react';
import { getQuestionContent } from 'utils/question';

import { PDF } from 'utils/pdf';

import ClientData from './ClientData';
import AdvancedOptions from './AdvancedOptions';

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
      radar: false,
      barPerContext: false,
      barPerQuestion: true,
      line: false,
      advanced: false,
      height: 200,
    };
    this.ref = null;
  }
  setHeight = (event, data) => {
    this.setState({ height: parseInt(data.value) }); // eslint-disable-line radix
  }
  toggleDiagramm = (dia) => {
    this.setState(() => ({ [dia]: !this.state[dia] }));
  }
  toggleAdvanced = () => {
    this.setState({ advanced: !this.state.advanced });
  }
  // generate a pdf, including all selected Chart types
  generatePDF = () => {
    const {
      barsPerContext,
      barsPerQuestion,
      radar,
      lines,
    } = this.ref;
    const clientId = this.state.selectedClient;
    const { clients } = this.props.data;
    const client = `${clients[clientId].firstname} ${clients[clientId].name}`;
    const pdf = new PDF(client, true, '', true);
    if (this.state.barPerQuestion) {
      const array = Object.keys(barsPerQuestion).map(key => (barsPerQuestion[key]));
      array.forEach((d) => {
        Object.keys(d.barsPerQuestion).forEach((qId) => {
          const chart = d.barsPerQuestion[qId];
          pdf.addBarChart(chart.getChart(), getQuestionContent(this.props.data.questions[qId], 'he'));
        });
      });
    }
    if (this.state.barPerContext) {
      const barsArray = Object.keys(barsPerContext).map(key => (barsPerContext[key]));
      barsArray.forEach(chart => (
        pdf.addBarChart(chart.barPerContext.getChart(), chart.state.context)
      ));
    }
    if (this.state.line) {
      const barsArray = Object.keys(lines).map(key => (lines[key]));
      barsArray.forEach(chart => (
        pdf.addBarChart(chart.barPerContext.getChart(), chart.state.context)
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
      barPerContext,
      barPerQuestion,
      line,
      advanced,
      height,
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
            <Button.Group>
              <Button color={barPerContext ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('barPerContext')}>Bar/Kontext</Button>
              <Button color={line ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('line')}>Line/Kontext</Button>
              <Button color={barPerQuestion ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('barPerQuestion')}>Bar/Frage</Button>
              <Button color={radar ? 'blue' : 'grey'} onClick={() => this.toggleDiagramm('radar')}>Radar</Button>
            </Button.Group>
            <Button.Group floated="right">
              <Button
                positive
                onClick={this.generatePDF}
              >PDF
              </Button>
              <Button icon labelPosition="right">
                <Icon
                  name={(advanced) ? 'angle double down' : 'angle double up'}
                  onClick={this.toggleAdvanced}
                />Optionen
              </Button>
            </Button.Group>
            <Divider clearing />
            {advanced && (
              <AdvancedOptions height={height} setHeight={this.setHeight} />
            )}
            <ClientData
              {...this.props}
              height={height}
              clientId={selectedClient}
              radar={radar}
              barPerContext={barPerContext}
              barPerQuestion={barPerQuestion}
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
    questions: PropTypes.shape({}),
  }).isRequired,
  adminData: PropTypes.shape({}).isRequired,
};

export default PageContent;

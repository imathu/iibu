import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Select, Button, Icon, Divider } from 'semantic-ui-react';
import { LOGO } from 'constants/company';
import { getQuestionContent } from 'utils/question';

import { PDF } from 'utils/pdf';
import { getDataUri } from 'utils';

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
      cover: false,
      coverData: null,
      logo: null,
      logoRatio: 3,
      color: [1, 1, 1],
    };
    this.ref = null;
  }
  setHeight = (event, data) => {
    this.setState({ height: parseInt(data.value) }); // eslint-disable-line radix
  }
  setCover = (event, data) => {
    const { company } = (this.props.data) || 'testing';
    if (!this.state.cover) {
      getDataUri(LOGO[company].path, (logo) => {
        getDataUri('/HRmove_cover.png', (cover) => {
          this.setState({
            cover: !data.value,
            coverData: cover,
            logo,
            logoRatio: LOGO[company].ratio || 3,
            color: LOGO[company].color || [1, 1, 1],
          });
        });
      });
    } else {
      this.setState({ cover: false, coverData: null, logo: null });
    }
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
    let isFirstpage = true;
    const clientId = this.state.selectedClient;
    const { clients } = this.props.data;
    const client = `${clients[clientId].firstname} ${clients[clientId].name}`;
    const pdf = new PDF(client, false, '', true, this.state.cover);
    if (this.state.cover) {
      pdf.addCover(
        this.state.coverData,
        this.state.logo,
        this.state.logoRatio,
        this.state.color,
        client,
      );
      isFirstpage = false;
    }
    if (this.state.radar) {
      if (!isFirstpage) pdf.addPage();
      isFirstpage = false;
      pdf.addRadarChart(radar.radar.getChart());
    }
    if (this.state.barPerContext) {
      if (!isFirstpage) pdf.addPage();
      isFirstpage = false;
      const barsArray = Object.keys(barsPerContext).map(key => (barsPerContext[key]));
      barsArray.forEach((chart) => {
        pdf.addBarChart(null, chart.barPerContext.getChart(), chart.state.context);
        pdf.addLine();
      });
    }
    if (this.state.barPerQuestion) {
      if (!isFirstpage) pdf.addPage();
      isFirstpage = false;
      const array = Object.keys(barsPerQuestion).map(key => (barsPerQuestion[key]));
      array.forEach((d) => {
        Object.keys(d.barsPerQuestion).forEach((qId) => {
          const chart = d.barsPerQuestion[qId];
          pdf.addBarChart(d.state.context, chart.getChart(), getQuestionContent(this.props.data.questions[qId], 'he'));
          const remarks = (d.remarksPerQuestion[qId]
            && d.remarksPerQuestion[qId].props.remarks) || [];
          if (remarks && remarks.length > 0) {
            pdf.addRemarks(remarks);
          }
          pdf.addLine();
        });
      });
    }
    if (this.state.line) {
      if (!isFirstpage) pdf.addPage();
      isFirstpage = false;
      const barsArray = Object.keys(lines).map(key => (lines[key]));
      barsArray.forEach((chart) => {
        pdf.addBarChart(null, chart.barPerContext.getChart(), chart.state.context);
        pdf.addLine();
      });
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
      cover,
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
                  name={(advanced) ? 'angle double up' : 'angle double down'}
                  onClick={this.toggleAdvanced}
                />Optionen
              </Button>
            </Button.Group>
            <Divider clearing />
            {advanced && (
              <AdvancedOptions
                height={height}
                setHeight={this.setHeight}
                cover={cover}
                setCover={this.setCover}
              />
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

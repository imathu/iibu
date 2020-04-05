import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getContextById } from 'utils/context';
import { getQuestionContent } from 'utils/question';
import { Grid, Segment, Header, Divider } from 'semantic-ui-react';

import datalabels from 'chartjs-plugin-datalabels'; // eslint-disable-line

import { Analysis } from 'utils/analysis';

import RemarksPerQuestion from './RemarksPerQuestion';

const position = (d) => {
  switch (d.dataset.label) {
    case 'Deviation':
      return (d.dataset.data[d.dataIndex] >= 0.5);
    case 'Votes':
      return true;
    default:
      return false;
  }
};

const align = (d) => {
  switch (d.dataset.label) {
    case 'Deviation':
      return 'right';
    case 'Votes':
      return (d.dataset.data[d.dataIndex] < 1.5) ? 'right' : 'left';
    default:
      return 'left';
  }
};

const offset = d => (
  (d.dataset.type === 'bar') ? 12 : 5
);

// const backgroundColor = (d) => {
//   switch (d.dataset.label) {
//     case 'Deviation':
//       return 'white';
//     case 'Votes':
//       if (d.dataset.backgroundColor) return d.dataset.backgroundColor[d.dataIndex];
//       return d.dataset.borderColor;
//     default:
//       return 'white';
//   }
// };

const anchor = d => (
  d.dataset.label === 'Deviation' ? 'start' : 'end'
);

const color = (d) => {
  switch (d.dataset.label) {
    case 'Deviation':
      return 'white';
    case 'Votes':
      return (d.dataset.data[d.dataIndex] < 1.5) ? d.dataset.backgroundColor[d.dataIndex] : 'white';
    default:
      return 'black';
  }
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  legend: {
    display: false,
  },
  plugins: {
    datalabels: {
      display: position,
      anchor,
      align,
      offset,
      borderRadius: 4,
      color,
      font: {
        weight: 'bold',
      },
    },
  },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        suggestedMax: 5,
        fontColor: '#000',
      },
    }],
    yAxes: [{
      ticks: {
        fontColor: '#000',
      },
    }],
  },
};

const optionsPDF = {
  responsive: true,
  animation: {
    ...options.animation,
  },
  legend: {
    ...options.legend,
  },
  plugins: {
    datalabels: {
      ...options.plugins.datalabels,
      font: {
        ...options.plugins.datalabels.font,
        size: 16,
      },
    },
  },
  scales: {
    xAxes: [{
      ticks: {
        ...options.scales.xAxes[0].ticks,
        fontSize: 16,
      },
    }],
    yAxes: [{
      ticks: {
        ...options.scales.yAxes[0].ticks,
        fontSize: 16,
      },
    }],
  },
};

class ClientContextBarPerQuestion extends React.Component {
  static propTypes = {
    onRef: PropTypes.func.isRequired,
    data: PropTypes.shape({}).isRequired,
    adminData: PropTypes.shape({
      contexts: PropTypes.shape({}),
    }).isRequired,
    clientId: PropTypes.string.isRequired,
    contextId: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      context: '',
    };
  }

  componentDidMount() {
    this.setContext();
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  setContext = () => (
    this.setState(() =>
      ({ context: getContextById(this.props.adminData.contexts, this.props.contextId) }))
  );

  render() {
    const {
      contextId,
      clientId,
      data,
      adminData,
      height,
    } = this.props;
    const { context } = this.state;
    const a = new Analysis(data, adminData);
    const questionIds = Object.keys(data.questions)
      .filter(qId => data.questions[qId].context === contextId);
    this.barsPerQuestion = [];
    this.remarksPerQuestion = [];
    return (
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column className="barChart" width={6}>
              <Header as="h3">{context}</Header>
            </Grid.Column>
            <Grid.Column width={10}>
              &nbsp;
            </Grid.Column>
          </Grid.Row>
          {questionIds.map((qId) => {
            const { barData, remarks } = a.getBarByQuestion(contextId, qId, clientId);
            return (
              <React.Fragment key={qId}>
                <Grid.Row>
                  <Grid.Column className="barChart" width={6}>
                    {getQuestionContent(data.questions[qId], 'he')}
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div>
                      <RC2
                        id={qId}
                        data={barData}
                        type="horizontalBar"
                        options={options}
                        // height={height}
                        style={{ height }}
                      />
                    </div>
                    <div>
                      <RC2
                        id={`${qId}PDF`}
                        data={barData}
                        type="horizontalBar"
                        options={optionsPDF}
                        height={80}
                        ref={(ref) => {
                          this.barsPerQuestion[qId] = ref;
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </Grid.Column>
                  {remarks.length > 0 &&
                  <Grid.Row>
                    <Segment style={{ paddingLeft: '20px' }}>
                      <Header as="h3">Kommentare zu dieser Frage:</Header>
                      <RemarksPerQuestion
                        remarks={remarks}
                        ref={(ref) => {
                          this.remarksPerQuestion[qId] = ref;
                        }}
                      />
                    </Segment>
                  </Grid.Row>
                  }
                </Grid.Row>
                <Divider />
              </React.Fragment>
            );
          })
          }
        </Grid>
      </Segment>
    );
  }
}

export default ClientContextBarPerQuestion;

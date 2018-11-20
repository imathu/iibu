import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getContextById } from 'utils/context';
import { getQuestionContent } from 'utils/question';
import { Grid, Segment } from 'semantic-ui-react';

import datalabels from 'chartjs-plugin-datalabels'; // eslint-disable-line

import { Analysis } from 'utils/analysis';

// const position = (d) => {
//   if (d.dataset.label === 'Votes') {
//     return true;
//   }
//   return false;
// };

// const color = (d) => {
//   if (d.dataset.backgroundColor) return d.dataset.backgroundColor[d.dataIndex];
//   return d.dataset.borderColor;
// };
//
// const align = (d) => {
//   if (d.dataset.type === 'bar') {
//     if (d.dataset.data[d.dataIndex] <= 1.5) return 220;
//     return 140;
//   }
//   return 'left';
// };
//
// const offset = d => (
//   (d.dataset.type === 'bar') ? 12 : 5
// );

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
      display: false,
    },
  },
  // plugins: {
  //   datalabels: {
  //     display: position,
  //     anchor: 'end',
  //     align,
  //     offset,
  //     backgroundColor: color,
  //     borderRadius: 4,
  //     color: 'white',
  //     font: {
  //       weight: 'bold',
  //     },
  //   },
  // },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        suggestedMax: 5,
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
  }
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

  componentDidUpdate() {
    // Object.keys(this.barsPerQuestion).forEach((id) => {
    //   this.barsPerQuestion[id].chart.update();
    // });
    // this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  setContext = () => (
    this.setState(() =>
      ({ context: getContextById(this.props.adminData.contexts, this.props.contextId) }))
  )

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
    return (
      <Segment>
        {height}
        <Grid>
          <Grid.Row>
            <Grid.Column className="barChart" width={6}>
              {context}
            </Grid.Column>
            <Grid.Column width={10}>
              &nbsp;
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {questionIds.map((qId) => {
              const barData = a.getBarByQuestion(contextId, qId, clientId);
              return (
                <React.Fragment key={qId}>
                  <Grid.Column className="barChart" width={6}>
                    {getQuestionContent(data.questions[qId], 'he')}
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div>
                      <RC2
                        id={qId}
                        data={barData}
                        type="horizontalBar"
                        ref={(ref) => { this.barsPerQuestion[qId] = ref; }}
                        options={options}
                        // height={height}
                        style={{ height }}
                      />
                    </div>
                  </Grid.Column>
                </React.Fragment>
              );
            })
          }
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default ClientContextBarPerQuestion;

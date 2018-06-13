import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getContextById } from 'utils/context';
import { Grid, Segment } from 'semantic-ui-react';

import datalabels from 'chartjs-plugin-datalabels'; // eslint-disable-line

import { Analysis } from 'utils/analysis';

const position = (d) => {
  if (d.dataset.label === 'Votes') {
    return true;
  }
  return false;
};

const color = (d) => {
  if (d.dataset.backgroundColor) return d.dataset.backgroundColor[d.dataIndex];
  return d.dataset.borderColor;
};

const align = (d) => {
  if (d.dataset.type === 'bar') {
    if (d.dataset.data[d.dataIndex] <= 1.5) return 220;
    return 140;
  }
  return 'left';
};

const offset = d => (
  (d.dataset.type === 'bar') ? 12 : 5
);

const options = {
  responsive: true,
  animation: {
    duration: 0,
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  plugins: {
    datalabels: {
      display: position,
      anchor: 'end',
      align,
      offset,
      backgroundColor: color,
      borderRadius: 4,
      color: 'white',
      font: {
        weight: 'bold',
      },
    },
  },
  elements: {
    point: {
      pointStyle: 'rectRot',
    },
  },
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        suggestedMax: 5,
      },
    }],
  },
};

class ClientContextBar extends React.Component {
  static propTypes = {
    onRef: PropTypes.func.isRequired,
    data: PropTypes.shape({}).isRequired,
    line: PropTypes.bool.isRequired,
    adminData: PropTypes.shape({
      contexts: PropTypes.shape({}),
    }).isRequired,
    clientId: PropTypes.string.isRequired,
    contextId: PropTypes.string.isRequired,
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
      line,
    } = this.props;
    const { context } = this.state;
    const a = new Analysis(data, adminData);
    const barData = a.getBarData(contextId, clientId, line);
    return (
      <Segment>
        <Grid>
          <Grid.Column className="barChart" width={3}>
            {context}
          </Grid.Column>
          <Grid.Column width={13}>
            <RC2
              id="rc2"
              ref={(ref) => { this.bar = ref; }}
              data={barData}
              type="bar"
              options={options}
              height={200}
            />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default ClientContextBar;

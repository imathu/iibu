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
        suggestedMax: 6,
        fontColor: '#000',
      },
    }],
    xAxes: [{
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
        size: 20,
      },
    },
  },
  elements: {
    point: {
      ...options.elements.point,
    },
  },
  scales: {
    yAxes: [{
      ticks: {
        ...options.scales.yAxes[0].ticks,
        fontSize: 20,
      },
    }],
    xAxes: [{
      ticks: {
        ...options.scales.xAxes[0].ticks,
        fontSize: 20,
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
      line,
      height,
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
              id="rcView"
              data={barData}
              type="bar"
              options={options}
              style={{ height }}
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <RC2
              id="rcPDF"
              data={barData}
              type="bar"
              height={(69 / 200) * height}
              options={optionsPDF}
              ref={(ref) => {
                this.barPerContext = ref;
              }}
              style={{ display: 'none' }}
            />
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default ClientContextBar;

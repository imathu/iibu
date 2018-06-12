import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getContextById } from 'utils/context';

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
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      plugins: {
        datalabels: {
          display: position,
          anchor: 'end',
          align: 150,
          offset: 25,
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
          },
        }],
      },
    };
    return (
      <tr>
        <td>
          {context}
        </td>
        <td>
          <RC2
            id="rc2"
            ref={(ref) => { this.bar = ref; }}
            data={barData}
            type="bar"
            options={options}
          />
        </td>
      </tr>
    );
  }
}

export default ClientContextBar;

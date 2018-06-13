import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';

import { Analysis } from 'utils/analysis';

import datalabels from 'chartjs-plugin-datalabels'; // eslint-disable-line

const f = context => (
  context.dataset.borderColor
);

const position = d => (
  (d.dataset.label === 'foreign') ? 'end' : 'start'
);

class ClientContextRadar extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    adminData: PropTypes.shape({}).isRequired,
    clientId: PropTypes.string.isRequired,
    onRef: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  render() {
    const { clientId, data, adminData } = this.props;
    const a = new Analysis(data, adminData);
    const radarData = a.getRadarData(clientId);
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 0,
      },
      scale: {
        pointLabels: {
          fontSize: 14,
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 5,
        },
      },
      plugins: {
        datalabels: {
          backgroundColor: f,
          borderRadius: 4,
          color: 'white',
          scale: 'radial',
          anchor: 'end',
          align: position,
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
    };
    return (
      <tr>
        <td>
          <RC2
            id="rc2"
            ref={(ref) => { this.radar = ref; }}
            data={radarData}
            type="radar"
            options={options}
          />
        </td>
      </tr>
    );
  }
}

ClientContextRadar.propTypes = {
  // onRef: PropTypes.func.isRequired,
};

export default ClientContextRadar;

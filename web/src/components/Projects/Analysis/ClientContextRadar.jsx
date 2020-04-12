import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';

import { Analysis } from 'utils/analysis';


class ClientContextRadar extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    adminData: PropTypes.shape({}).isRequired,
    clientId: PropTypes.string.isRequired,
    onRef: PropTypes.func.isRequired,
  };

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
          fontColor: '#000',
        },
      },
      plugins: {
        datalabels: {
          display: false,
        },
      },
      elements: {
        point: {
          pointStyle: 'rectRot',
        },
      },
    };
    const optionsPDF = {
      ...options,
      animation: { ...options.animation },
      scale: {
        pointLabels: {
          ...options.scale.pointLabels,
          fontSize: 20,
        },
        ticks: {
          ...options.scale.ticks,
          fontSize: 20,
        },
      },
      plugins: {
        datalabels: {
          ...options.plugins.datalabels,
        },
      },
      elements: {
        point: {
          ...options.elements.point,
        },
      },
      legend: {
        display: true,
        labels: {
          fontSize: 20,
        },
      },
    };
    return (
      <div>
        <RC2
          id="rcPDF"
          ref={(ref) => {
            this.radar = ref;
          }}
          data={radarData}
          type="radar"
          options={optionsPDF}
          style={{ height: '400px', width: '800px', display: 'none' }}
        />
        <RC2
          id="rcView"
          data={radarData}
          type="radar"
          options={options}
          style={{ height: '400px' }}
        />
      </div>
    );
  }
}

ClientContextRadar.propTypes = {
  // onRef: PropTypes.func.isRequired,
};

export default ClientContextRadar;

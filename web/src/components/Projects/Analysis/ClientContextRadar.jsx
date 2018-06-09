import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';

import { Analysis } from 'utils/analysis';

const options = {
  responsive: true,
  maintainAspectRatio: true,
  scale: {
    ticks: {
      beginAtZero: true,
      max: 5,
    },
  },
};

class ClientContextRadar extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    adminData: PropTypes.shape({}).isRequired,
    clientId: PropTypes.string.isRequired,
  }
  // componentDidMount() {
  //   this.props.onRef(this);
  // }
  //
  // componentWillUnmount() {
  //   this.props.onRef(undefined);
  // }
  render() {
    const { clientId, data, adminData } = this.props;
    const a = new Analysis(data, adminData);
    const radarData = a.getRadarData(clientId);
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

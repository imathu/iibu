import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getContextById } from 'utils/context';

import { Analysis } from 'utils/analysis';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: true,
  },
  scales: {
    xAxes: [{
      ticks: {
        beginAtZero: true,
        max: 5,
      },
    }],
    yAxes: [{
      categoryPercentage: 0.8,
      min: 0,
    }],
  },
};

class ClientContextBar extends React.Component {
  static propTypes = {
    // barData: PropTypes.shape({}).isRequired,
    // onRef: PropTypes.func.isRequired,
    // label: PropTypes.string.isRequired,
    data: PropTypes.shape({}).isRequired,
    adminData: PropTypes.shape({}).isRequired,
    clientId: PropTypes.string.isRequired,
    contextId: PropTypes.string.isRequired,
  }

  // componentDidMount() {
  //   this.props.onRef(this);
  // }
  //
  // componentWillUnmount() {
  //   this.props.onRef(undefined);
  // }

  render() {
    const {
      contextId,
      clientId,
      data,
      adminData,
    } = this.props;
    const a = new Analysis(data, adminData);
    const context = getContextById(adminData.contexts, contextId);
    const barData = a.getBarData(contextId, clientId);
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

import React from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';
import { getDataByRoleAndContext } from 'utils/analysis';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
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
    }],
  },
};

class ClientContextBar extends React.Component {
  static propTypes = {
    // barData: PropTypes.shape({}).isRequired,
    // onRef: PropTypes.func.isRequired,
    // label: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
  }

  // componentDidMount() {
  //   this.props.onRef(this);
  // }
  //
  // componentWillUnmount() {
  //   this.props.onRef(undefined);
  // }

  render() {
    const { context } = this.props;
    const barData = getDataByRoleAndContext();
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
            type="horizontalBar"
            options={options}
          />
        </td>
      </tr>
    );
  }
}

export default ClientContextBar;

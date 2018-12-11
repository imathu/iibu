import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

class RemarksPerQuestion extends React.Component {
  static propTypes = {
    remarks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  render() {
    const { remarks } = this.props;
    return (
      <List>
        {remarks.map(r => (
          <List.Item
            key={r.questionId$ + r.feedbackerId}
            ref={(ref) => { this.remarkItemPerQuestion = ref; }}
          >
            {r.id} - {r.remark}
          </List.Item>
        ))}
      </List>
    );
  }
}

export default RemarksPerQuestion;


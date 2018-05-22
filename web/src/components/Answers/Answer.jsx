import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Checkbox, List } from 'semantic-ui-react';

import idx from 'idx';

import { db } from '../../firebase';

const key = (id, index) => `${id}-${index}`;

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  componentDidMount = () => {
    const { feedbacker, clientId, questionId } = this.props;
    const value = idx(feedbacker, _ =>
      _.clients[clientId].answers[questionId].score) || 0;
    this.setState(() => ({ value }));
  }
  handleChange = (e, { value }) => {
    this.setState(() => ({ value }));
    db.doUpdateAnswer(
      this.props.projectId,
      this.props.feedbacker.id,
      this.props.clientId,
      this.props.questionId,
      value,
    );
  }
  render() {
    const { value } = this.state;
    const { scores, feedbacker } = this.props;
    return (
      <Form>
        <List horizontal>
          {[...Array(scores)].map((x, i) => (
            <List.Item key={key(feedbacker.id, i)}>
              <Form.Field>
                <Checkbox
                  radio
                  name="checkboxRadioGroup"
                  value={i + 1}
                  checked={value === (i + 1)}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </List.Item>
          ))}
        </List>
      </Form>
    );
  }
}

Answer.propTypes = {
  feedbacker: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  projectId: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  scores: PropTypes.number.isRequired,
};

export default Answer;

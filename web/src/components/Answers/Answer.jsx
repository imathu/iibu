import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Checkbox, List, Icon } from 'semantic-ui-react';

import { db } from '../../firebase';

const key = (id, index) => `${id}-${index}`;

const border = (i) => {
  if (i === 0) {
    return { borderRight: '3px solid lightgray', padding: '5px' };
  }
  return {};
};

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: -1,
    };
  }
  componentDidMount = () => {
    const { feedbacker, clientId, questionId } = this.props;
    const value = (
      feedbacker &&
      feedbacker.clients &&
      feedbacker.clients[clientId] &&
      feedbacker.clients[clientId].answers &&
      feedbacker.clients[clientId].answers[questionId] &&
      feedbacker.clients[clientId].answers[questionId].score);
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
            <List.Item
              key={key(feedbacker.id, i)}
              style={border(i)}
            >
              <Form.Field>
                <label
                  className="custom"
                  htmlFor={i}
                ><center>{i}</center>
                </label>
                <Checkbox
                  fitted
                  radio
                  name="checkboxRadioGroup"
                  value={i}
                  checked={value == (i)} // eslint-disable-line
                  onChange={this.handleChange}
                />
              </Form.Field>
            </List.Item>
          ))}
          { value >= 0 && (
            <List.Item>
              <Form.Field>
                <Icon color="green" name="checkmark" style={{ margin: '8px' }} />
              </Form.Field>
            </List.Item>
          )}
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

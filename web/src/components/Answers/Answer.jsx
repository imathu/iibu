import React from 'react';
import { PropTypes } from 'prop-types';
import { Form, Checkbox, List } from 'semantic-ui-react';

const key = (id, index) => `${id}-${index}`;

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }
  handleChange = (e, { value }) => this.setState({ value })
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
  feedbacker: PropTypes.shape({}).isRequired,
  scores: PropTypes.number.isRequired,
};

export default Answer;

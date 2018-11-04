import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Checkbox, Icon } from 'semantic-ui-react';

const getURI = (projectId, feedbackerId) => `/answers/${projectId}/${feedbackerId}`;

const getIcon = (numAnswers, numQuestions) => {
  const p = (numAnswers / numQuestions);
  if (p >= 1) return <Icon color="green" name="checkmark" style={{ paddingLeft: '8px' }} />;
  if (p >= 0.5) return <Icon color="orange" name="exclamation circle" style={{ paddingLeft: '8px' }} />;
  return <Icon color="red" name="exclamation circle" style={{ paddingLeft: '8px' }} />;
};

class FeedbackerRow extends React.Component {
  static propTypes = {
    adminData: PropTypes.shape({}).isRequired,
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    toggleSelect: PropTypes.func.isRequired,
  }
  toggleSelect = (id) => {
    this.props.toggleSelect(id);
  }
  render() {
    const {
      adminData,
      feedbackerId,
      projectId,
      selected,
    } = this.props;
    let numAnswers = 0;
    const feedbacker = adminData.project.feedbackers[feedbackerId];
    const { questions } = adminData.project;
    let numQuestions = (questions) ? Object.keys(questions).length : 0;
    const { clients } = feedbacker;
    if (clients) {
      Object.keys(clients).forEach((id) => {
        const { answers } = clients[id];
        numAnswers += (answers) ? Object.keys(answers).length : 0;
      });
      numQuestions *= (Object.keys(clients).length);
    }
    return (
      <Table.Row>
        <Table.Cell><a target="_blank" rel="noopener noreferrer" href={getURI(projectId, feedbackerId)}>{feedbackerId}</a></Table.Cell>
        <Table.Cell>{feedbacker.email}</Table.Cell>
        <Table.Cell>{feedbacker.gender}</Table.Cell>
        <Table.Cell>
          {numAnswers}/{numQuestions}
          {getIcon(numAnswers, numQuestions)}
        </Table.Cell>
        <Table.Cell>
          {feedbacker.notActive
            ? <Icon color="green" name="checkmark" style={{ paddingLeft: '8px' }} />
            : <Icon color="red" name="exclamation circle" style={{ paddingLeft: '8px' }} />
          }
        </Table.Cell>
        <Table.Cell>
          {// eslint-disable-next-line
          <Link
            to={{
             pathname: `/project/${projectId}/feedbackgeber/${feedbackerId}`,
             state: feedbacker,
            }}
          > Details
          </Link>
          }
        </Table.Cell>
        <Table.Cell>
          <Checkbox
            checked={selected.indexOf(feedbackerId) !== -1}
            onChange={() => this.toggleSelect(feedbackerId)}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default FeedbackerRow;

import React from 'react';
import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';

import { db } from '../../../firebase';

class FeedbackerList extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      feedbackers: [],
      client: this.props.client,
    };
  }
  componentDidMount = () => {
    db.onceGetFeedbackers(this.props.projectId).then((snapshot) => {
      const feedbackers = snapshot.val();
      const feedbackerArray = Object.keys(feedbackers).map(id => feedbackers[id]);
      this.setState(() => ({
        feedbackers: feedbackerArray.filter(fdbk => (fdbk.clients[this.state.client.id])),
      }));
    });
  }
  render() {
    const { feedbackers, client } = this.state;
    return (
      <Table celled padded size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Mail</Table.HeaderCell>
            <Table.HeaderCell>Geschlecht</Table.HeaderCell>
            <Table.HeaderCell>Rolle</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {feedbackers.map(feedbacker => (
            <Table.Row key={feedbacker.id}>
              <Table.Cell>{feedbacker.email}</Table.Cell>
              <Table.Cell>{feedbacker.gender}</Table.Cell>
              <Table.Cell>{feedbacker.clients[client.id].role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default FeedbackerList;

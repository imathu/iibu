import React from 'react';
import { PropTypes } from 'prop-types';
import { Table } from 'semantic-ui-react';

import { db } from '../../firebase';

class Feedbackers extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
      }),
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }
  componentDidMount() {
    const p = this.props.match.params.projectId;
    db.onceGetFeedbackers(p).then((snapshot) => {
      this.setState(() => ({ data: snapshot.val() }));
    });
  }
  render() {
    const { data } = this.state;
    return (
      <div>
        <h1>Feedbackgeber</h1>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Geschlecht</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <Table.Row key={id}>
                <Table.Cell>{data[id].email}</Table.Cell>
                <Table.Cell>{data[id].gender}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Feedbackers;

// const authCondition = authUser => !!authUser;
// export default withAuthorization(authCondition)(Feedbackers);

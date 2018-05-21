import React from 'react';
import { PropTypes } from 'prop-types';
import { Table, Header } from 'semantic-ui-react';

import { db } from '../../firebase';

const getUrl = (projectId, feedbackerId) => `/answers/${projectId}/${feedbackerId}`;

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
    const { projectId } = this.props.match.params;
    return (
      <div>
        <Header floated="left" as="h1">Feedbackgeber</Header>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Geschlecht</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <Table.Row key={id}>
                <Table.Cell><a target="_blank" href={getUrl(projectId, id)}>{id}</a></Table.Cell>
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

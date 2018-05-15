import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Loader, Divider } from 'semantic-ui-react';

import ClientDetail from './ClientDetail';
import FeedbackerList from './FeedbackerList';

import { db } from '../../../firebase';

class ClientDetails extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        clientId: PropTypes.string,
        projectId: PropTypes.string,
      }),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      client: {},
    };
  }
  componentDidMount = () => {
    const { projectId, clientId } = this.props.match.params;
    db.onceGetClient(projectId, clientId).then(snapshot =>
      this.setState(() => ({ client: snapshot.val() })));
  }
  render() {
    const { client } = this.state;
    const { projectId } = this.props.match.params;
    return (
      <React.Fragment>
        <Header floated="left" as="h1">Feedbacknehmer {client.name} {client.firstname}</Header>
        {(client.name)
        ?
          <div>
            <ClientDetail client={client} projectId={projectId} />
            <Divider />
            <FeedbackerList projectId={projectId} client={client} />
          </div>
        : <Loader active inline="centered" />
      }
      </React.Fragment>
    );
  }
}

export default ClientDetails;

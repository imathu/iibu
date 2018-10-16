import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Header } from 'semantic-ui-react';
import Parser from 'utils/parser';

import NoClients from './NoClients';
import ClientList from './ClientList';

import { db } from '../../../firebase';

class Clients extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      editedData: false,
      clients: this.props.data,
      feedbackers: {},
    };
  }
  onClientsSave = () => {
    db.doCreateClients(
      this.props.match.params.projectId,
      this.state.clients,
    ).then(() => (db.doCreateFeedbackers(
      this.props.match.params.projectId,
      this.state.feedbackers,
    ))).then(() => this.setState(() => ({ editedData: false })));
  }
  handleFileUpload = (data) => {
    const file = data.target.files[0];
    const reader = new FileReader();
    reader.onload = (() => (
      (e) => {
        Parser.parseClients(e.target.result).then((d) => {
          if (d) {
            this.setState(() => ({
              feedbackers: d.feedbackers,
              clients: d.clients,
              editedData: true,
            }));
          }
        });
      }
    ))(file);
    reader.readAsText(file, 'ISO-8859-1');
  }
  render() {
    const { editedData, clients, feedbackers } = this.state;
    return (
      <React.Fragment>
        <Header floated="left" as="h1">Feedbacknehmer</Header>
        {(Object.keys(clients).length > 0)
          ? <ClientList
            clients={clients}
            projectId={this.props.match.params.projectId}
            feedbackers={feedbackers}
            editedData={editedData}
            onClientsSave={this.onClientsSave}
          />
          : <NoClients
            handleFileUpload={this.handleFileUpload}
          />
        }
      </React.Fragment>
    );
  }
}

const dbFunction = db.onceGetClients;
export default withLoader(dbFunction, 'projectId')(Clients);

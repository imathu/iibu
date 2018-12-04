import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import { getURL } from 'utils';
import AdminDataContext from 'components/AdminDataContext';
import { Table, Header, Checkbox, Button, Modal, Form, Input, TextArea, List } from 'semantic-ui-react';

import FeedbackerRow from './FeedbackerRow';

import { firebase, db } from '../../../firebase';

const getURI = (projectId, feedbackerId) => `/answers/${projectId}/${feedbackerId}`;

const defaultText = `
Guten Tag
  
Sie wurden als Feedbackgeber für die 360 Grad Feedbackanalyse ausgewählt.

Ziel der 360 Grad Feedbackanalyse ist es, Führungskräften eine umfassende Rückmeldung zu ihrem Führungsverhalten zu geben und dadurch Ansatzpunkte für die persönliche Weiterentwicklung zu ermitteln.

Im Rahmen des Feedbacks erfolgt eine Einschätzung des Verhaltens durch den Vorgesetzten, die Kollegen, die Mitarbeiter und allfälligen internen und externen Kunden sowie durch die Führungskraft selbst. Die Einschätzungen der Kollegen, Mitarbeiter und Kunden werden jeweils zu Mittelwerten zusammengefasst. Rückschlüsse auf einzelne Feedbackgeber sind dadurch nicht mehr möglich. Die Vorgesetzten- und die Selbsteinschätzung werden einzeln aufgeführt.

Das Feedback erfolgt mittels des folgenden Online-Fragebogens, der Aussagen zum Führungsverhalten enthält. Bitte schätzen Sie ein, in welchem Ausmass die einzelnen Aussagen auf den Feedbacknehmer zutreffen.

Bitte geben Sie Ihre Einschätzung aufgrund des beobachteten Verhaltens im Arbeitsalltag und in der Zusammenarbeit ab. Geben Sie bei jeder Aussage den Wert an, der Ihrer Einschätzung am ehesten entspricht. Es geht hier nicht um richtige oder falsche Antworten, sondern um Ihre persönliche Meinung.

Bitte nehmen Sie sich ca. 15 Minuten Zeit für das Feedback und bearbeiten Sie jede einzelne Aussage, andernfalls ist eine sinnvolle und objektive Auswertung Ihrer Angaben nicht möglich.

Wichtig: Ihre Angaben werden laufend gespeichert, so dass Sie diese auch zu einem späteren Zeitpunkt nochmals über Ihren persönlichen Zugangslink aufrufen können. Sobald Sie mit Ihren Angaben zufrieden sind, klicken Sie bitte auf "Eingaben abschicken".

Bearbeiten Sie den Fragebogen bitte bis spätestens am Donnerstag, 15.11.2018. Danach ist kein Zugang zur Berfragung mehr möglich.

Die Datenerhebung und -auswertung erfolgt durch die Skillsgarden AG, die Anonymität, Datensicherheit und Vertraulichkeit sicherstellt.

Mit dem folgenden personalisierten Zugangslink gelangen Sie zur Umfrage: 

$LINK

Bitte beachten Sie: Realfeedback ist unsere Domain für 360 Grad Feedbackanalysen und kein Drittanbieter

Vielen Dank für Ihre Mitarbeit!
Bei Fragen wenden Sie sich bitte an info@realfeedback.ch.

Freundliche Grüsse 
Ihr Feedback Team
`;

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  changedData: true,
});

function toggle(array, id) {
  if (array.indexOf(id) === -1) {
    array.push(id);
    return array;
  }
  return array.filter(i => i !== id);
}

class Feedbackers extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string,
      }),
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selected: [],
      modal: false,
      emailSubject: 'Feedbackanalyse',
      emailText: defaultText,
    };
  }
  componentDidMount() {
    const p = this.props.match.params.projectId;
    db.onceGetFeedbackers(p).then((snapshot) => {
      this.setState(() => ({ data: snapshot.val() }));
    });
  }
  toggleAll = () => {
    const { data, selected } = this.state;
    const allSelected = (data && (Object.keys(data).length === selected.length));
    this.setState(() => ({ selected: (!allSelected) ? Object.keys(this.state.data) : [] }));
  }
  toggleSelect = (id) => {
    this.setState(() => ({ selected: toggle(this.state.selected, id) }));
  }
  open = () => {
    this.setState(() => ({ modal: true }));
  }
  close = () => {
    this.setState(() => ({ modal: false, selected: [] }));
  }
  send = () => {
    const {
      emailText,
      emailSubject,
      selected,
      data,
    } = this.state;
    const { projectId } = this.props.match.params;
    const feedbackers = [];
    const regex = /\$LINK/g;
    selected.forEach((id) => {
      const url = getURL() + getURI(projectId, id);
      const feedbacker = {
        id,
        projectId,
        emailAddress: data[id].email,
        emailText: emailText.replace(regex, url),
        emailSubject,
      };
      feedbackers.push(feedbacker);
    });
    const body = {
      feedbackers,
    };
    const API = `/api/v1/${projectId}/mail`;
    firebase.auth.currentUser.getIdToken(true).then((idToken) => {
      fetch(API, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: idToken,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Server Error', response.status, ' ', response.statusText);
        })
        .then(() => {
          this.close();
        })
        .catch((e) => {
          alert(e); // eslint-disable-line
          this.close();
        });
    }).catch((error) => {
      console.log(error); // eslint-disable-line
      this.props.history.push(routes.LANDING);
    });
  }
  render() {
    const {
      data,
      selected,
      modal,
      emailSubject,
      emailText,
    } = this.state;
    const { projectId } = this.props.match.params;
    const allSelected = (!!data && (Object.keys(data).length === selected.length));
    return (
      <div>
        <Header floated="left" as="h1">Feedbackgeber</Header>
        <Modal open={modal}>
          <Modal.Header>E-Mail an Feedbacker Senden</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form>
                <Form.Field
                  id="subject"
                  control={Input}
                  label="Subject"
                  value={emailSubject}
                  onChange={event => this.setState(byPropKey('emailSubject', event.target.value))}
                />
                <Form.Field
                  id="text"
                  control={TextArea}
                  label="Text"
                  value={emailText}
                  onChange={event => this.setState(byPropKey('emailText', event.target.value))}
                />
              </Form>
              <br /><br />
              <b>Emails werden gesendet an folgende Feedbacker:</b>
              <List>
                {!!data && !!selected && selected.map(id => (
                  <List.Item key={id}>{data[id].email}</List.Item>
                ))}
              </List>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="black" onClick={this.close}>
              Abbrechen
            </Button>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Senden"
              onClick={this.send}
            />
          </Modal.Actions>
        </Modal>
        <Button
          floated="right"
          onClick={this.open}
          disabled={selected.length <= 0}
        >Mail
        </Button>
        <Table celled padded size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Mail</Table.HeaderCell>
              <Table.HeaderCell>Geschlecht</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Abgeschlossen</Table.HeaderCell>
              <Table.HeaderCell>Details</Table.HeaderCell>
              <Table.HeaderCell>
                <Checkbox
                  checked={!!allSelected}
                  onChange={this.toggleAll}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!!data && Object.keys(data).map(id => (
              <AdminDataContext.Consumer key={id}>
                {adminData => (adminData && adminData.project
                  ? <FeedbackerRow
                    feedbackerId={id}
                    selected={selected}
                    adminData={adminData}
                    projectId={projectId}
                    toggleSelect={this.toggleSelect}
                  />
                  : null)}
              </AdminDataContext.Consumer>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default withRouter(Feedbackers);

// const authCondition = authUser => !!authUser;
// export default withAuthorization(authCondition)(Feedbackers);

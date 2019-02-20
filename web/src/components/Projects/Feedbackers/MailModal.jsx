import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Modal, Form, Input, TextArea, List, Loader, Dimmer } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import { getURL } from 'utils';
import { LOGO } from 'constants/company';

import { firebase } from '../../../firebase';

const getURI = (projectId, feedbackerId) => `/answers/${projectId}/${feedbackerId}`;

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  changedData: true,
});

const defaultText = mail => `
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
Bei Fragen wenden Sie sich bitte an ${mail}.

Freundliche Grüsse 
Ihr Feedback Team
`;


class MailModal extends React.Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    data: PropTypes.shape({}).isRequired,
    selected: PropTypes.arrayOf(PropTypes.string).isRequired,
    project: PropTypes.shape({
      company: PropTypes.string,
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }
  state = {
    emailSubject: 'Feedbackanalyse',
    emailText: defaultText(LOGO[this.props.project.company].mail),
    mailStatus: null,
    mailResult: {},
  }
  close = () => {
    this.setState({ mailStatus: null });
    this.props.close();
  }
  send = () => {
    const { emailText, emailSubject } = this.state;
    const {
      project,
      projectId,
      selected,
      data,
    } = this.props;
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
    const API = `/api/v1/${project.company}/${projectId}/mail`;
    this.setState({ mailStatus: 'sending' });
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
        .then((mailResult) => {
          this.setState({ mailStatus: 'done', mailResult });
          // this.props.close();
        })
        .catch((e) => {
          alert(e); // eslint-disable-line
          this.props.close();
        });
    }).catch((error) => {
      console.log(error); // eslint-disable-line
      this.props.history.push(routes.LANDING);
    });
  }
  render() {
    const {
      selected,
      data,
      modal,
      close,
    } = this.props;
    const {
      emailText,
      emailSubject,
      mailStatus,
      mailResult,
    } = this.state;
    return (
      <React.Fragment>
        <Modal open={modal && !mailStatus}>
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
            <Button color="black" onClick={close}>
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
        <Modal open={modal && (mailStatus === 'sending')}>
          <Modal.Header>E-Mail an Feedbacker Senden</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <br />
              <Dimmer active inverted>
                <Loader size="medium" />
              </Dimmer>
              <br />
            </Modal.Description>
          </Modal.Content>
        </Modal>
        <Modal open={modal && (mailStatus === 'done')}>
          <Modal.Header>E-Mail Sending Status</Modal.Header>
          <Modal.Content>
            {mailResult.okMails && mailResult.okMails.length > 0 && (
              <div>
                <h2>gesendete Mails</h2>
                <List>
                  {mailResult.okMails.map(mail => (
                    <List.Item key={mail}>
                      <List.Icon name="thumbs up outline" color="green" />
                      <List.Content>{mail}</List.Content>
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
            {mailResult.errMails && mailResult.errMails.length > 0 && (
              <div>
                <h2>nicht gesendet</h2>
                <List>
                  {mailResult.errMails.map(mail => (
                    <List.Item key={mail}>
                      <List.Icon name="x" color="red" />
                      <List.Content>{mail}</List.Content>
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="OK"
              onClick={this.close}
            />
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(MailModal);

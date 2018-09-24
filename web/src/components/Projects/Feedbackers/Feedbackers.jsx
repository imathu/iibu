import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import * as routes from 'constants/routes';
import { getURL } from 'utils';
import { Table, Header, Checkbox, Button, Modal, Form, Input, TextArea, List } from 'semantic-ui-react';

import { firebase, db } from '../../../firebase';

const getURI = (projectId, feedbackerId) => `/answers/${projectId}/${feedbackerId}`;

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
      emailText: 'Guten Tag\n\nBitte rufen sie folgenden Link auf: $LINK',
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
              <Table.Row key={id}>
                <Table.Cell><a target="_blank" rel="noopener noreferrer" href={getURI(projectId, id)}>{id}</a></Table.Cell>
                <Table.Cell>{data[id].email}</Table.Cell>
                <Table.Cell>{data[id].gender}</Table.Cell>
                <Table.Cell>
                  {// eslint-disable-next-line
                  <Link
                    to={{
                     pathname: `/project/${projectId}/feedbackgeber/${id}`,
                     state: data[id],
                    }}
                  > Details
                  </Link>
                  }
                </Table.Cell>
                <Table.Cell>
                  <Checkbox
                    checked={selected.indexOf(id) !== -1}
                    onChange={() => this.toggleSelect(id)}
                  />
                </Table.Cell>
              </Table.Row>
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

import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table, List, Button, Header, Segment, Divider, Modal, Form, Input } from 'semantic-ui-react';

import Parser from 'utils/parser';

import { db } from '../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const parseQuestionsToState = (questionsArray) => {
  const d = {};
  questionsArray.forEach((q) => {
    d[q.id] = {};
    d[q.id].scores = q.scores;
    d[q.id].context = q.context;
    d[q.id].content = q.content;
  });
  return d;
};

class Questions extends React.Component {
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
      data: this.props.data,
      editedData: false,
      open: false,
      title: '',
      description: '',
      showTemplates: false,
      templateQuestions: {},
    };
  }

  onQuestionsSave = () => {
    db.doCreateQuestions(this.props.match.params.projectId, this.state.data).then(() =>
      this.setState(() => ({ editedData: false })));
  }
  onQuestionsDelete = () => {
    db.doRemoveQuestions(this.props.match.params.projectId).then(() =>
      this.setState(() => ({ data: {} })));
  }
  onTemplateSave = () => {
    db.doCreateTemplate(
      this.state.title,
      this.state.description,
      this.state.data,
    ).then(() =>
      this.close());
  }

  focusTextInput = (e) => {
    e.preventDefault();
    this.input.click();
  }

  show = () => this.setState({ open: true })
  close = () => {
    this.setState({ open: false });
  }

  importFromTemplate = questions => this.setState({ data: questions, editedData: true });

  showTemplates = () => {
    db.onceGetTemplates().then(snapshot =>
      this.setState({ templateQuestions: snapshot.val() }));
    this.setState({ showTemplates: true });
  }

  handleFileUpload = (data) => {
    const file = data.target.files[0];
    const reader = new FileReader();
    reader.onload = (() => (
      (e) => {
        Parser.parseQuestions(e.target.result).then((questions) => {
          if (questions) {
            this.setState(() => ({
              data: parseQuestionsToState(questions),
              editedData: true,
            }));
          }
        });
      }
    ))(file);
    reader.readAsText(file);
  }
  render() {
    const {
      data,
      open,
      title,
      description,
    } = this.state;
    const isInvalid = title === '';
    if (Object.keys(data).length > 0) {
      return (
        <div>
          <Header floated="left" as="h1">Fragebogen</Header>
          {this.state.editedData &&
            <Button
              color="green"
              onClick={() => this.onQuestionsSave()}
            >Fragen speichern
            </Button>
          }
          <Button.Group size="tiny" basic floated="right">
            <Button basic onClick={() => this.onQuestionsDelete()}>Löschen</Button>
            {!this.state.editedData &&
              <Button basic onClick={() => this.show()}>als Template speichern</Button>
            }
          </Button.Group>
          <Modal size="tiny" open={open} onClose={() => this.close()}>
            <Modal.Header>
              Fragebogen als Template speichern
            </Modal.Header>
            <Form style={{ margin: '20px' }}>
              <Form.Field>
                <Input
                  label={{ icon: 'asterisk' }}
                  labelPosition="left corner"
                  type="text"
                  id="title"
                  placeholder="Titel"
                  value={title}
                  onChange={event => this.setState(byPropKey('title', event.target.value))}
                />
              </Form.Field>
              <Form.Field>
                <input
                  placeholder="Beschreibung"
                  value={description}
                  onChange={event => this.setState(byPropKey('description', event.target.value))}
                />
              </Form.Field>
            </Form>
            <Modal.Actions>
              <Button negative onClick={this.close}>
                Abbrechen
              </Button>
              <Button
                onClick={this.onTemplateSave}
                positive
                icon="checkmark"
                labelPosition="right"
                content="Speichern"
                disabled={isInvalid}
              />
            </Modal.Actions>
          </Modal>
          <Table celled padded size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Thema</Table.HeaderCell>
                <Table.HeaderCell>Skore</Table.HeaderCell>
                <Table.HeaderCell>Formulierung</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!!data && Object.keys(data).map(id => (
                <Table.Row key={id}>
                  <Table.Cell>{id}</Table.Cell>
                  <Table.Cell>{data[id].context}</Table.Cell>
                  <Table.Cell>{data[id].scores}</Table.Cell>
                  <Table.Cell>
                    <List>
                      <List.Item
                        key={data[id].content.de.he}
                      >
                        de: {data[id].content.de.he}
                      </List.Item>
                      <List.Item
                        key={data[id].content.en.he}
                      >en: {data[id].content.en.he}
                      </List.Item>
                    </List>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      );
    }
    return (
      <div>
        <Header floated="left" as="h1">Fragebogen</Header>
        <input
          style={{ display: 'none' }}
          id="import"
          type="file"
          accept=".csv"
          ref={(ref) => { this.input = ref; }}
          onChange={d => this.handleFileUpload(d, this.props.match.params.projectId)}
        />
        <br /><br />
        <Segment padded>
          <Button to="#" fluid onClick={this.focusTextInput}>Import von File</Button>
          <Divider horizontal>Or</Divider>
          <Button fluid onClick={this.showTemplates}>Import von Template</Button>
        </Segment>
        {this.state.showTemplates &&
          <Table celled padded size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Titel</Table.HeaderCell>
                <Table.HeaderCell>Beschreibung</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!!this.state.templateQuestions &&
                Object.keys(this.state.templateQuestions).map(id => (
                  <Table.Row key={id}>
                    <Table.Cell>{id}</Table.Cell>
                    <Table.Cell>{this.state.templateQuestions[id].title}</Table.Cell>
                    <Table.Cell>{this.state.templateQuestions[id].description}</Table.Cell>
                    <Table.Cell><Button onClick={() => this.importFromTemplate(this.state.templateQuestions[id].questions)} size="tiny">import</Button></Table.Cell>
                  </Table.Row>
              ))}
            </Table.Body>
          </Table>
        }
      </div>
    );
  }
}

// export default Questions;

const dbFunction = db.onceGetQuestions;
export default withLoader(dbFunction, 'projectId')(Questions);

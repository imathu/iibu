import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Table, List, Button, Header, Segment, Divider } from 'semantic-ui-react';

import Parser from 'utils/parser';

import { db } from '../../firebase';

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

  focusTextInput = (e) => {
    e.preventDefault();
    this.input.click();
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
    const { data } = this.state;
    if (Object.keys(data).length > 0) {
      return (
        <div>
          <Header floated="left" as="h1">Fragebogen</Header>
          <Button.Group floated="right">
            {this.state.editedData &&
              <Button
                color="green"
                onClick={() => this.onQuestionsSave()}
              >Fragen speichern
              </Button>
            }
            <Button onClick={() => this.onQuestionsDelete()}>Löschen</Button>
          </Button.Group>
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
          <Button fluid disabled>Import von Template</Button>
        </Segment>
      </div>
    );
  }
}

// export default Questions;

const dbFunction = db.onceGetQuestions;
export default withLoader(dbFunction, 'projectId')(Questions);

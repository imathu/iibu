import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Table, Button, Divider } from 'semantic-ui-react';

import { db } from '../../../firebase';

class NoQuestions extends React.Component {
  static propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
    importFromTemplate: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      showTemplates: false,
      templateQuestions: {},
    };
  }
  showTemplates = () => {
    db.onceGetTemplates().then(snapshot =>
      this.setState({ templateQuestions: snapshot.val() }));
    this.setState({ showTemplates: true });
  }
  focusTextInput = (e) => {
    e.preventDefault();
    this.input.click();
  }
  render() {
    return (
      <div>
        <input
          style={{ display: 'none' }}
          id="import"
          type="file"
          accept=".csv"
          ref={(ref) => { this.input = ref; }}
          onChange={d => this.props.handleFileUpload(d)}
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
                    <Table.Cell><Button onClick={() => this.props.importFromTemplate(this.state.templateQuestions[id].questions)} size="tiny">import</Button></Table.Cell>
                  </Table.Row>
              ))}
            </Table.Body>
          </Table>
        }
      </div>
    );
  }
}

export default NoQuestions;

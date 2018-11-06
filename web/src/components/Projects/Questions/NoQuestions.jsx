import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Table, Button, Divider, Radio } from 'semantic-ui-react';

import { db } from '../../../firebase';

class NoQuestions extends React.Component {
  static propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
    importFromTemplate: PropTypes.func.isRequired,
  }
  state = {
    showTemplates: false,
    templateQuestions: {},
    encoding: 'UTF-8',
  };
  showTemplates = () => {
    db.onceGetTemplates().then(snapshot =>
      this.setState({ templateQuestions: snapshot.val() }));
    this.setState({ showTemplates: true });
  }
  focusTextInput = (e) => {
    e.preventDefault();
    this.input.click();
  }
  handleEncoding = (e, data) => {
    this.setState({ encoding: data.value });
  }
  render() {
    const { encoding } = this.state;
    return (
      <div>
        <input
          style={{ display: 'none' }}
          id="import"
          type="file"
          accept=".csv"
          ref={(ref) => { this.input = ref; }}
          onChange={d => this.props.handleFileUpload(d, encoding)}
        />
        <br /><br />
        <Segment padded>
          <div style={{ textAlign: 'center' }}>
            <Radio
              label="UTF-8"
              name="radioGroup"
              value="UTF-8"
              checked={encoding === 'UTF-8'}
              onChange={this.handleEncoding}
              style={{ paddingRight: '10px' }}
            />
            <Radio
              label="ISO (Windows)"
              name="radioGroup"
              value="ISO-8859-1"
              checked={encoding === 'ISO-8859-1'}
              onChange={this.handleEncoding}
              style={{ paddingRight: '10px' }}
            />
            <Button to="#" onClick={this.focusTextInput}>Import von File</Button>
          </div>
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

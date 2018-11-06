import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Button, Radio } from 'semantic-ui-react';

class NoClients extends React.Component {
  static propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
  }
  state = {
    encoding: 'UTF-8',
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
      <React.Fragment>
        <br /><br />
        <input
          style={{ display: 'none' }}
          id="import"
          type="file"
          accept=".csv"
          ref={(ref) => { this.input = ref; }}
          onChange={d => this.props.handleFileUpload(d, encoding)}
        />
        <Segment padded>
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
        </Segment>
      </React.Fragment>
    );
  }
}

export default NoClients;

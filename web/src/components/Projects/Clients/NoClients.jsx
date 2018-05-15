import React from 'react';
import { PropTypes } from 'prop-types';
import { Segment, Button } from 'semantic-ui-react';

class NoClients extends React.Component {
  static propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
  }
  focusTextInput = (e) => {
    e.preventDefault();
    this.input.click();
  }
  render() {
    return (
      <React.Fragment>
        <br /><br />
        <input
          style={{ display: 'none' }}
          id="import"
          type="file"
          accept=".csv"
          ref={(ref) => { this.input = ref; }}
          onChange={d => this.props.handleFileUpload(d)}
        />
        <Segment padded>
          <Button to="#" fluid onClick={this.focusTextInput}>Import von File</Button>
        </Segment>
      </React.Fragment>
    );
  }
}

export default NoClients;

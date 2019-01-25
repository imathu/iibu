import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Segment, Form, Checkbox } from 'semantic-ui-react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

class AdvancedOptions extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    setHeight: PropTypes.func.isRequired,
    cover: PropTypes.bool.isRequired,
    setCover: PropTypes.func.isRequired,
    hasDescription: PropTypes.bool.isRequired,
    enableDescription: PropTypes.func.isRequired,
    updateDescription: PropTypes.func.isRequired,
    description: PropTypes.string.isRequired,
  };

  handleChange = (value) => {
    this.props.updateDescription(value);
  }

  render() {
    const {
      height,
      setHeight,
      hasDescription,
      enableDescription,
      cover,
      setCover,
      description,
    } = this.props;
    return (
      <Segment>
        <Header as="h3">Format Optionen</Header>
        <Segment>
          <Form.Input
            label={`Diagramm Grösse: ${height}px `}
            min={100}
            max={300}
            name="height"
            onChange={setHeight}
            step={10}
            type="range"
            value={height}
          />
        </Segment>
        <Segment>
          <Form.Field>
            <Checkbox
              label="Deckblatt"
              checked={cover}
              onChange={setCover}
            />
          </Form.Field>
        </Segment>
        <Segment>
          <Form.Field>
            <Checkbox
              label="Beschreibung"
              checked={hasDescription}
              onChange={enableDescription}
            />
          </Form.Field>
          {hasDescription &&
            <React.Fragment>
              <ReactQuill value={description} onChange={this.handleChange} />
            </React.Fragment>
          }
        </Segment>
      </Segment>
    );
  }
}

export default AdvancedOptions;

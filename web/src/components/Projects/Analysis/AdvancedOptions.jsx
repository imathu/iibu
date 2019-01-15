import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Segment, Form, Checkbox } from 'semantic-ui-react';

const AdvancedOptions = (props) => {
  const { height } = props;
  return (
    <Segment>
      <Header as="h3">Format Optionen</Header>
      <Segment>
        <Form.Input
          label={`Diagramm Grösse: ${height}px `}
          min={100}
          max={300}
          name="height"
          onChange={props.setHeight}
          step={10}
          type="range"
          value={height}
        />
      </Segment>
      <Segment>
        <Form.Field>
          <Checkbox
            label="Deckblatt"
            checked={props.cover}
            onChange={props.setCover}
          />
        </Form.Field>
      </Segment>
    </Segment>
  );
};
AdvancedOptions.propTypes = {
  height: PropTypes.number.isRequired,
  setHeight: PropTypes.func.isRequired,
  cover: PropTypes.bool.isRequired,
  setCover: PropTypes.func.isRequired,
};

export default AdvancedOptions;

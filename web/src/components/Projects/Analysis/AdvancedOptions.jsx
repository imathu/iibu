import React from 'react';
import { PropTypes } from 'prop-types';
import { Header, Segment, Form, Checkbox, Button } from 'semantic-ui-react';
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
    descriptions: PropTypes.array.isRequired,
  };

  componentDidMount = () => {
    const existingDesciptions = localStorage.getItem('descriptions') ? JSON.parse(localStorage.getItem('descriptions')) : [' '];
    existingDesciptions.forEach((existingDescription, index) => this.props.updateDescription(existingDescription, index));
  };

  handleChange = (value, index) => {
    this.props.updateDescription(value, index);
  };

  addNewPage = () => {
    const newIndex = this.props.descriptions.length;
    this.props.updateDescription(' ', newIndex);
  };

  removePage = (number) => {
    const existingDescriptions = this.props.descriptions;
    existingDescriptions.splice(number, 1);
    existingDescriptions.forEach((desc, index) => {
      this.props.updateDescription(desc, index, index === 0);
    });
  };

  render() {
    const {
      height,
      setHeight,
      hasDescription,
      enableDescription,
      cover,
      setCover,
      descriptions,
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
          <div className="descriptions">
            {hasDescription && descriptions && descriptions[0] && (
              // Kein for loop weil sonst bei jeder Änderung des Descriptions
              // alles neu instanziert wird und das zu einem Memory Leak führt
              <div className="pageEditor">
                <div>Seite 1 <button onClick={() => this.removePage(0)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[0]}
                  onChange={value => this.handleChange(value, 0)}
                />
              </div>
            )}
            {hasDescription && descriptions && descriptions[1] && (
              <div className="pageEditor">
                <div>Seite 2 <button onClick={() => this.removePage(1)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[1]}
                  onChange={value => this.handleChange(value, 1)}
                />
              </div>
            )}
            {hasDescription && descriptions && descriptions[2] && (
              <div className="pageEditor">
                <div>Seite 3 <button onClick={() => this.removePage(2)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[2]}
                  onChange={value => this.handleChange(value, 2)}
                />
              </div>
            )}
            {hasDescription && descriptions && descriptions[3] && (
              <div className="pageEditor">
                <div>Seite 4 <button onClick={() => this.removePage(3)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[3]}
                  onChange={value => this.handleChange(value, 3)}
                />
              </div>
            )}
            {hasDescription && descriptions && descriptions[4] && (
              <div className="pageEditor">
                <div>Seite 5 <button onClick={() => this.removePage(4)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[4]}
                  onChange={value => this.handleChange(value, 4)}
                />
              </div>
            )}
            {hasDescription && descriptions && descriptions[5] && (
              <div className="pageEditor">
                <div>Seite 6 <button onClick={() => this.removePage(5)}>Löschen</button></div>
                <ReactQuill
                  value={descriptions[5]}
                  onChange={value => this.handleChange(value, 5)}
                />
              </div>
            )}
            {hasDescription && descriptions.length < 6 && (
              <Button onClick={() => this.addNewPage()}>
                Weitere Seite hinzufügen
              </Button>
            )}
          </div>
        </Segment>
      </Segment>
    );
  }
}

export default AdvancedOptions;

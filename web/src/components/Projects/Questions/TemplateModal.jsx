import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Modal, Form, Input } from 'semantic-ui-react';

import { db } from '../../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  changedData: true,
});

class TemplateModal extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    };
  }
  onTemplateSave = () => {
    db.doCreateTemplate(
      this.state.title,
      this.state.description,
      this.props.data,
    ).then(() =>
      this.props.closeModal());
  }
  render() {
    const { title, description } = this.state;
    const isInvalid = title === '';
    return (
      <Modal size="tiny" open={this.props.open} onClose={() => this.props.closeModal()}>
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
          <Button negative onClick={this.props.closeModal}>
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
    );
  }
}

export default TemplateModal;

import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, Button } from 'semantic-ui-react';

class PopUp extends React.Component {
  close = () => {
    this.props.close();
  }
  render() {
    const {
      messageId,
      open,
      title,
      size,
    } = this.props;
    return (
      <Modal size={size} open={open} onClose={this.close}>
        {title &&
          <Modal.Header>{title}</Modal.Header>
        }
        <Modal.Content>
          <FormattedMessage
            id={messageId}
            defaultMessage="Systemmeldung"
            values={{ what: 'react-intl' }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="OK"
            onClick={this.close}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
PopUp.propTypes = {
  size: PropTypes.string,
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  messageId: PropTypes.string.isRequired,
};
PopUp.defaultProps = {
  title: null,
  size: 'mini',
};

export default PopUp;

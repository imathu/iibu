import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Modal } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    component: PropTypes.string,
  }
  static defaultProps = {
    component: 'unknown',
  }

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.setState({ hasError: true });
    console.log(error); // eslint-disable-line no-console
    console.log('error in component:', this.props.component); // eslint-disable-line no-console
  }

  render() {
    if (this.state.hasError) {
      return (
        <Modal open>
          <Modal.Header>
            <FormattedMessage
              id="app.errorBoundaryHeader"
              defaultMessage="Ein Fehler ist aufgetreten"
              values={{ what: 'react-intl' }}
            />
          </Modal.Header>
          <Modal.Content>
            <FormattedMessage
              id="app.errorBoundaryContent"
              defaultMessage="In der Applikation ist ein Fehler aufgetreten"
              values={{ what: 'react-intl' }}
            />
          </Modal.Content>
        </Modal>
      );
    }
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);

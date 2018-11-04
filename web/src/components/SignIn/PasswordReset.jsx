import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import LanguageContext from 'components/LanguageContext';
import PopUp from 'components/PopUp';
import { Segment, Input, Form, Button, Message } from 'semantic-ui-react';
import { auth, codes } from '../../firebase';

const PasswordResetPage = ({ history }) => (
  <div>
    <Segment
      compact
      style={{
       textAlign: 'center',
       vertical: true,
       margin: 'auto',
       marginTop: '20px',
      }}
    >
      <h1>
        <FormattedMessage
          id="app.pwdResetTitle"
          defaultMessage="Passwort zurücksetzen"
          values={{ what: 'react-intl' }}
        />
      </h1>
      <PasswordResetForm history={history} />
    </Segment>
  </div>
);
PasswordResetPage.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

const INITIAL_STATE = {
  email: '',
  error: null,
  message: null,
  showMessage: false,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null,
});

class PasswordResetForm extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }
  state = { ...INITIAL_STATE };

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        this.setState({ showMessage: true });
      })
      .catch((error) => {
        this.setState({ error });
        this.setState({ showMessage: false });
      });
    event.preventDefault();
  }

  closeMessage = () => {
    this.setState({ showMessage: false });
    this.props.history.push(routes.SIGN_IN);
  }

  render() {
    const {
      email,
      error,
      showMessage,
    } = this.state;
    const isInvalid = email === '';
    return (
      <LanguageContext.Consumer>
        {lang => (
          <React.Fragment>
            <Form error onSubmit={this.onSubmit}>
              <Form.Field
                id="email"
                icon="user"
                iconPosition="left"
                fluid
                control={Input}
                placeholder="Mail"
                value={email}
                onChange={event => this.setState(byPropKey('email', event.target.value))}
              />
              { error &&
                <Message error content={codes.errCode(error, lang.language)} />
              }
              <Button disabled={isInvalid} type="submit">Reset</Button>
            </Form>
            <PopUp
              open={showMessage}
              messageId="app.PasswordResetOk"
              close={this.closeMessage}
            />
          </React.Fragment>
        )}
      </LanguageContext.Consumer>
    );
  }
}
const PasswordResetLink = () => (
  <div>
    <FormattedMessage
      id="app.pwdResetQuestion"
      defaultMessage="Passwort zurücksetzen?"
      values={{ what: 'react-intl' }}
    />
    {' '}
    {// eslint-disable-next-line
    }<Link to={routes.PASSWORD_RESET}>Reset</Link>
  </div>);

export default withRouter(PasswordResetPage);

export {
  PasswordResetForm,
  PasswordResetLink,
};

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import * as routes from 'constants/routes';
import { Segment } from 'semantic-ui-react';
import { auth } from '../../firebase';

const PasswordResetPage = ({ history }) => (
  <div>
    <Segment style={{
       textAlign: 'center',
       width: '60%',
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
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class PasswordResetForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        this.setState(byPropKey('message', 'password reset link sent to your email'));
      })
      .catch((error) => {
        this.setState(byPropKey('error', error));
        this.setState(byPropKey('message', ''));
      });
    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
      message,
    } = this.state;
    const isInvalid = email === '';
    return (
      <form onSubmit={this.onSubmit}>
        <input
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">Reset</button>
        { error && <p>{error.message}</p> }
        { message && <p>{message}</p> }
      </form>
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

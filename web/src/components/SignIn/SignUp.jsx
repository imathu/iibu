import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import LanguageContext from 'components/LanguageContext';
import Language from 'components/Language';
import * as routes from 'constants/routes';
import { Segment, Input, Form, Button, Message } from 'semantic-ui-react';
import { auth, codes } from '../../firebase';

const SignUpPage = ({ history }) => (
  <div>
    <Language languages={{ en: 'true' }} />
    <Segment
      compact
      style={{
       textAlign: 'center',
       vertical: true,
       margin: 'auto',
       marginTop: '20px',
      }}
    >
      <h1>Sign Up</h1>
      <FormattedMessage
        id="app.signUpMessage"
        defaultMessage="Eröffnen Sie mit Ihrere Mail Adresse einen Accountn"
        values={{ what: 'react-intl' }}
      />
      <hr />
      <SignUpForm history={history} />
    </Segment>
  </div>
);
SignUpPage.propTypes = {
  history: PropTypes.shape({}).isRequired,
};

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
  error: null,
});

class SignUpForm extends Component {
  static propTypes = {
    history: PropTypes.shape({}).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, passwordOne } = this.state;
    const { history } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        history.push(routes.LANDING);
      })
      .catch((error) => {
        this.setState({ error });
      });
    event.preventDefault();
  }

  render() {
    const {
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '';
    return (
      <LanguageContext.Consumer>
        {lang => (
          <Form error onSubmit={this.onSubmit}>
            <Form.Field
              id="email"
              fluid
              icon="user"
              iconPosition="left"
              control={Input}
              placeholder="Mail"
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
            />
            <Form.Field
              id="passwordOne"
              fluid
              icon="lock"
              iconPosition="left"
              control={Input}
              placeholder="Passwort"
              value={passwordOne}
              type="password"
              onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
            />
            <Form.Field
              id="passwordTwo"
              fluid
              icon="lock"
              iconPosition="left"
              control={Input}
              placeholder="Passwort Wiederholen"
              value={passwordTwo}
              type="password"
              onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
            />
            { error &&
              <Message error content={codes.errCode(error, lang.language)} />
            }
            <Button disabled={isInvalid} type="submit">Sign Up</Button>
          </Form>
        )}
      </LanguageContext.Consumer>
    );
  }
}
const SignUpLink = () => (
  <div>
    <FormattedMessage
      id="app.signUpQuestion"
      defaultMessage="Sie haben noch keinen Account?"
      values={{ what: 'react-intl' }}
    />
    {' '}
    {// eslint-disable-next-line
    }<Link to={routes.SIGN_UP}>Sign Up</Link>
  </div>);

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
};

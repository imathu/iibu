import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Loader, Divider, Grid, Sticky, Segment, Modal, Header, Button, Icon, Checkbox } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import Language from 'components/Language';
import * as routes from 'constants/routes';
import Client from './Client';
import Menu from './Menu';

import { firebase, db } from '../../firebase';

class AnswersList extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      modalShow: true,
      checkBoxToggle: false,
    };
  }
  componentDidMount = () => {
    const { projectId, feedbackerId } = this.props;
    const API = `/api/v1/${projectId}/answers/${feedbackerId}`;
    firebase.auth.currentUser.getIdToken(true).then((idToken) => {
      fetch(API, { headers: { Authorization: idToken } })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('not authorized');
        })
        .then((data) => {
          if (!data.err) {
            this.setState({ data });
            if (data.feedbacker && data.feedbacker.noBanner) {
              this.setState(() => ({ modalShow: false }));
            }
          } else {
            throw new Error('an unexpected error occured', data.err);
          }
        }).catch((e) => {
          alert(e); // eslint-disable-line
          this.props.history.push(routes.LANDING);
        });
    }).catch((error) => {
      console.log(error); // eslint-disable-line
    });
  }
  closeModal = () => {
    this.setState(() => ({ modalShow: false }));
    if (this.state.checkBoxToggle) {
      db.doDisableBanner(
        this.props.projectId,
        this.state.data.feedbacker.id,
      );
    }
  }
  checkBoxToggle = () => {
    this.setState(() => ({ checkBoxToggle: !this.state.checkBoxToggle }));
  }
  handleContextRef = contextRef => this.setState({ contextRef });
  render() {
    const { projectId } = this.props;
    const { data } = this.state;
    const { contextRef, modalShow, checkBoxToggle } = this.state;
    if (data && data.feedbacker) {
      const numQuestions = Object.keys(data.questions).length;
      return (
        <LanguageContext.Consumer>
          {language => (
            <React.Fragment>
              <Modal open={modalShow}>
                <Header>
                  <FormattedMessage
                    id="feedback.bannerHeader"
                    defaultMessage="Willkommen als Feedbackgeber"
                    values={{ what: 'react-intl' }}
                  />
                </Header>
                <Modal.Content>
                  <Language language={language} languages={data.languages} />
                  {data.clientBanner[language.language]}
                </Modal.Content>
                <Modal.Actions>
                  <Checkbox
                    label="diese Nachricht nicht mehr anzeigen"
                    checked={checkBoxToggle}
                    onClick={this.checkBoxToggle}
                  />
                  <Button color="green" onClick={this.closeModal}>
                    <Icon name="checkmark" /> Gelesen
                  </Button>
                </Modal.Actions>
              </Modal>
              <Language languages={data.languages} />
              <Grid style={{ marginTop: '5px' }} stackable columns={2} reversed="mobile vertically">
                <Grid.Column width={12}>
                  <div ref={this.handleContextRef}>
                    {Object.keys(data.feedbacker.clients).map(id => (
                      <div key={id}>
                        <Client
                          contexts={data.contexts}
                          roles={data.roles}
                          questions={data.questions}
                          client={data.clients[id]}
                          feedbacker={data.feedbacker}
                          updateAnswer={this.updateAnswer}
                          projectId={projectId}
                        />
                        <Divider />
                      </div>
                    ))}
                  </div>
                </Grid.Column>
                <Grid.Column width={4}>
                  <Sticky context={contextRef} offset={10}>
                    <Segment style={{ backgroundColor: 'lightgray' }}>
                      {Object.keys(data.feedbacker.clients).map(id => (
                        <div key={id}>
                          <Menu
                            feedbacker={data.feedbacker}
                            numQuestions={numQuestions}
                            projectId={projectId}
                            client={data.clients[id]}
                          />
                        </div>
                      ))}
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </Grid>
            </React.Fragment>
          )}
        </LanguageContext.Consumer>
      );
    }
    return (
      <React.Fragment>
        <Loader active inline="centered" />
        <Segment style={{ textAlign: 'center' }}>
          <FormattedMessage
            id="feedback.waitForData"
            defaultMessage="Daten werden geladen"
            values={{ what: 'react-intl' }}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default withRouter(AnswersList);

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Loader, Divider, Grid, Sticky, Segment, Modal, Header, Button, Icon, Checkbox } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import Language from 'components/Language';
import * as routes from 'constants/routes';
import Client from './Client';
import Footer from './Footer';
import { Menu as ContextMenu } from './Menu';

import { firebase, db } from '../../firebase';

class AnswersList extends React.Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    feedbackerId: PropTypes.string.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };
  state = {
    data: null,
    modalShow: true,
    checkBoxToggle: false,
    clients: [],
  };
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
            if (data.feedbacker) {
              // add a watcher for the number of answers for each client
              Object.keys(data.feedbacker.clients).forEach((clientId) => {
                db.numAnswers(projectId, data.feedbacker.id, clientId).on('value', (snapshot) => {
                  this.setState(() => ({
                    clients: {
                      ...this.state.clients,
                      [clientId]: snapshot.numChildren(),
                    },
                  }));
                });
              });
            }
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
  close = () => {
    this.setState(() => ({ closeManually: true }));
  }
  handleContextRef = contextRef => this.setState({ contextRef });
  render() {
    const { projectId, feedbackerId } = this.props;
    const { data, clients } = this.state;
    const {
      contextRef,
      modalShow,
      checkBoxToggle,
    } = this.state;
    let totalAnswers = 0;
    Object.keys(clients).forEach((id) => {
      totalAnswers += clients[id];
    });
    if (data && data.feedbacker) {
      const questionsPerFeedbacker = Object.keys(data.questions).length;
      const numQuestions = questionsPerFeedbacker * Object.keys(clients).length;
      const end = (totalAnswers > 0 && totalAnswers >= numQuestions);
      // const percent = 100 * (totalAnswers / (numQuestions));
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
                          <ContextMenu
                            feedbacker={data.feedbacker}
                            numQuestions={questionsPerFeedbacker}
                            numAnswers={clients[id] || 0}
                            projectId={projectId}
                            client={data.clients[id]}
                          />
                        </div>
                      ))}
                    </Segment>
                  </Sticky>
                </Grid.Column>
              </Grid>
              <Footer
                end={end}
                totalAnswers={totalAnswers}
                numQuestions={numQuestions}
                projectId={projectId}
                feedbackerId={feedbackerId}
              />
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

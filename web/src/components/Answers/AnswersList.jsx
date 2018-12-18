import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Loader, Divider, Grid, Sticky, Segment, Modal, Header, Button, Icon, Checkbox, Image } from 'semantic-ui-react';
import LanguageContext from 'components/LanguageContext';
import { LOGO } from 'constants/company';
import Language from 'components/Language';
import * as routes from 'constants/routes';
import Client from './Client';
import Footer from './Footer';
import MatchText from './MatchText';
import { Menu as ContextMenu } from './Menu';

import { firebase, db } from '../../firebase';

const message = () => (
  <FormattedMessage
    id="feedback.BannerToggle"
    defaultMessage="Diese Nachricht nicht mehr anzeigen"
    values={{ what: 'react-intl' }}
  />
);

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
    const image = (data) ? LOGO[data.company] : null;
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
                  <Button size="mini" basic floated="right" onClick={this.closeModal}>
                    <Icon name="close" />
                  </Button>
                </Header>
                <Modal.Content scrolling>
                  <Language language={language} languages={{ en: 'true' }} />
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {data.clientBanner[language.language]}
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  {image &&
                    <Image floated="left" size="small" src={image} />
                  }
                  <Checkbox
                    // eslint-disable-next-line
                    label={<label htmlFor="toggle">{message()}</label>}
                    checked={checkBoxToggle}
                    onClick={this.checkBoxToggle}
                  />
                  <Button color="green" onClick={this.closeModal}>
                    <Icon name="checkmark" />
                    <FormattedMessage
                      id="feedback.buttonRead"
                      defaultMessage="Gelesen"
                      values={{ what: 'react-intl' }}
                    />
                  </Button>
                </Modal.Actions>
              </Modal>
              <Segment>
                <Grid stackable>
                  <Grid.Column width={15}>
                    {image &&
                      <Image size="small" src={image} style={{ display: 'inline-block' }} />
                    }
                  </Grid.Column>
                  <Grid.Column width={1} textAlign="right">
                    <div style={{ float: 'right' }}>
                      <Language language={language} languages={{ en: 'true' }} />
                    </div>
                  </Grid.Column>
                </Grid>
              </Segment>

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
                  <Sticky context={contextRef} offset={9}>
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
                      <hr />
                      <MatchText />
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

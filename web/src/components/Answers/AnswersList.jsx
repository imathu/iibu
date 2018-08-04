import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Sticky, Segment, Modal, Header, Button, Icon, Checkbox } from 'semantic-ui-react';
import Client from './Client';
import Menu from './Menu';

import { db } from '../../firebase';

class AnswersList extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      feedbacker: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    projectId: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      modalShow: true,
      checkBoxToggle: false,
    };
  }
  componentDidMount = () => {
    const { feedbacker } = this.props.data;
    if (feedbacker && feedbacker.noBanner) {
      this.setState(() => ({ modalShow: false }));
    }
  }
  closeModal = () => {
    this.setState(() => ({ modalShow: false }));
    if (this.state.checkBoxToggle) {
      db.doDisableBanner(
        this.props.projectId,
        this.props.data.feedbacker.id,
      );
    }
  }
  checkBoxToggle = () => {
    this.setState(() => ({ checkBoxToggle: !this.state.checkBoxToggle }));
  }
  handleContextRef = contextRef => this.setState({ contextRef });
  render() {
    const { data, projectId } = this.props;
    const { contextRef, modalShow, checkBoxToggle } = this.state;
    const numQuestions = Object.keys(data.questions).length;
    if (data.feedbacker) {
      return (
        <React.Fragment>
          <Modal open={modalShow}>
            <Header content="Willkommen als Feedbackgeber" />
            <Modal.Content>
              {data.clientBanner}
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
          <Grid stackable columns={2} reversed="mobile vertically">
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
      );
    }
    return (
      <Segment style={{ textAlign: 'center' }}>no data found, check your URL</Segment>
    );
  }
}

export default AnswersList;

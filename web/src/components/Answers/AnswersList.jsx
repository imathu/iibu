import React from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Sticky, Segment, Header } from 'semantic-ui-react';
import Client from './Client';
import Menu from './Menu';

class AnswersList extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    projectId: PropTypes.string.isRequired,
  };
  state = {};
  handleContextRef = contextRef => this.setState({ contextRef });
  render() {
    const { data, projectId } = this.props;
    const { contextRef } = this.state;
    const numQuestions = Object.keys(data.questions).length;
    if (data.feedbacker) {
      return (
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
      );
    }
    return (
      <Segment style={{ textAlign: 'center' }}>no data found, check your URL</Segment>
    );
  }
}

export default AnswersList;

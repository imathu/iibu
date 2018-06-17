import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Segment, Form, Input, TextArea, Button, Grid, Header } from 'semantic-ui-react';

import { db } from '../../firebase';

const byPropKey = (project, propertyName, value) => () => ({
  project: {
    ...project,
    [propertyName]: value,
  },
  changedData: true,
});

class ProjectEdit extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      project: {
        projectId: null,
        name: '',
        clientBanner: '',
      },
    };
  }
  componentDidMount = () => {
    const { search } = this.props.location;
    const params = new URLSearchParams(search);
    if (params.has('projectId')) {
      db.onceGetProject(params.get('projectId')).then((snapshot) => {
        if (snapshot.val()) {
          this.setState(() => ({
            project: {
              id: params.get('projectId'),
              name: snapshot.val().name || '',
              clientBanner: snapshot.val().clientBanner || '',
            },
          }));
        }
      }).catch(() => null);
    }
  }
  onSave = () => {
    const { project } = this.state;
    if (project.id) {
      db.doUpdateProjectData(project.id, project.name, project.clientBanner).then(() =>
        this.setState(() => ({ changedData: false })));
    } else {
      db.doCreateProject(project.id, project.name, project.clientBanner).then(() =>
        this.setState(() => ({ changedData: false })));
    }
  }
  render() {
    const { project, changedData } = this.state;
    const save = changedData && project.name !== '';
    return (
      <div className="admin-content" style={{ width: '70%' }}>
        <Header as="h1">
          {(project.id)
            ? <div>Projetdaten ändern</div>
            : <div>neues Projekt erstellen</div>
          }
        </Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Segment>
                <Form>
                  <Form.Group>
                    <Form.Field
                      id="name"
                      control={Input}
                      label="Name"
                      placeholder="Name"
                      width={8}
                      value={project.name}
                      onChange={event => this.setState(byPropKey(project, 'name', event.target.value))}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Field
                      id="clientBanner"
                      control={TextArea}
                      label="Feedbackgeber intro Banner"
                      placeholder="Text, der dem Feedbackgeber angezeigt wird"
                      width={12}
                      value={project.clientBanner}
                      onChange={event => this.setState(byPropKey(project, 'clientBanner', event.target.value))}
                    />
                  </Form.Group>
                </Form>
              </Segment>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.onSave}
                positive
                icon="checkmark"
                labelPosition="right"
                content="Speichern"
                disabled={!save}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(ProjectEdit);

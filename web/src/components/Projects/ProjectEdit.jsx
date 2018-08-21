import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Segment, Form, Input, TextArea, Button, Grid, Header, Checkbox } from 'semantic-ui-react';

import { db } from '../../firebase';

const byPropKey = (project, propertyName, value) => () => ({
  project: {
    ...project,
    [propertyName]: value,
  },
  changedData: true,
});

const setBanner = (project, language, value) => () => ({
  project: {
    ...project,
    clientBanner: {
      ...project.clientBanner,
      [language]: value,
    },
  },
  changedData: true,
});

class ProjectEdit extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      project: {
        projectId: null,
        name: '',
        clientBanner: {
          de: '',
          en: '',
          fr: '',
        },
        languages: {
          de: true,
          en: false,
          fr: false,
        },
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
              clientBanner: snapshot.val().clientBanner || {},
              languages: snapshot.val().languages || {},
            },
          }));
        }
      }).catch(() => null);
    }
  }
  onSave = () => {
    const { project } = this.state;
    if (project.id) {
      db.doUpdateProjectData(project.id, project).then(() =>
        this.setState(() => ({ changedData: false })));
    } else {
      db.doCreateProject(project.id, project).then(() =>
        this.setState(() => ({ changedData: false })));
    }
  }
  onCancel = () => {
    this.props.history.push('/projects');
  }
  onToggleLanguage = (event, data) => {
    const { project } = this.state;
    const key = data.label;
    const val = !project.languages[key];
    this.setState(() => ({
      project: {
        ...project,
        languages: {
          ...project.languages,
          [key]: val,
        },
      },
      changedData: true,
    }));
  }
  render() {
    const { project, changedData } = this.state;
    const { languages } = project || {};
    const save = changedData && project.name !== '';
    return (
      <div className="admin-content" style={{ width: '50%' }}>
        <Header as="h1">
          {(project.id)
            ? <div>Projektdaten ändern</div>
            : <div>Ein neues Projekt erstellen</div>
          }
        </Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                <Form>
                  <Form.Field
                    id="name"
                    control={Input}
                    label="Name"
                    placeholder="Name"
                    width={8}
                    value={project.name}
                    onChange={event => this.setState(byPropKey(project, 'name', event.target.value))}
                  />
                  <Form.Field>
                    <Checkbox
                      toggle
                      label="de"
                      checked={languages.de}
                      disabled
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      toggle
                      label="en"
                      checked={languages.en}
                      onChange={this.onToggleLanguage}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      toggle
                      label="fr"
                      checked={languages.fr}
                      onChange={this.onToggleLanguage}
                      disabled
                    />
                  </Form.Field>
                  <Form.Field
                    id="deClientBanner"
                    control={TextArea}
                    label="Feedbackgeber intro Banner (deutsch)"
                    placeholder="Text, der dem Feedbackgeber in Deutsch angezeigt wird"
                    width={16}
                    value={project.clientBanner.de}
                    onChange={event => this.setState(setBanner(project, 'de', event.target.value))}
                  />
                  {languages.en && (
                    <Form.Field
                      id="enclientBanner"
                      control={TextArea}
                      label="Feedbackgeber intro Banner (englisch)"
                      placeholder="Text, der dem Feedbackgeber in Eglisch angezeigt wird"
                      width={16}
                      value={project.clientBanner.en}
                      onChange={event => this.setState(setBanner(project, 'en', event.target.value))}
                    />
                  )}
                  {languages.fr && (
                    <Form.Field
                      id="frclientBanner"
                      control={TextArea}
                      label="Feedbackgeber intro Banner (französisch)"
                      placeholder="Text, der dem Feedbackgeber in Französisch angezeigt wird"
                      width={16}
                      value={project.clientBanner.fr}
                      onChange={event => this.setState(setBanner(project, 'fr', event.target.value))}
                    />
                  )}
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <br />
        <Button
          onClick={this.onSave}
          positive
          icon="checkmark"
          labelPosition="right"
          content="Speichern"
          disabled={!save}
          floated="right"
        />
        <Button
          onClick={this.onCancel}
          primary
          floated="right"
        >Cancel
        </Button>
      </div>
    );
  }
}

export default withRouter(ProjectEdit);

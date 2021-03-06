import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Button, Header } from 'semantic-ui-react';
import AdminDataContext from 'components/AdminDataContext';

import Parser from 'utils/parser';

import NoQuestions from './NoQuestions';
import QuestionList from './QuestionList';
import TemplateModal from './TemplateModal';

import { db } from '../../../firebase';

const parseQuestionsToState = (questionsArray) => {
  const d = {};
  questionsArray.forEach((q) => {
    d[q.id] = {};
    d[q.id].scores = q.scores;
    d[q.id].context = q.context;
    d[q.id].content = q.content;
  });
  return d;
};

class Questions extends React.Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        projectId: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      editedData: false,
      open: false,
      contexts: [],
      newContexts: [],
    };
  }

  componentDidMount = () => {
    db.onceGetContexts().then((snapshot) => {
      if (snapshot.val()) {
        const contextArray = [];
        const contextsObject = snapshot.val();
        Object.keys(contextsObject).forEach((key) => {
          contextArray.push({
            id: key,
            de: contextsObject[key].de,
            en: contextsObject[key].en,
            fr: contextsObject[key].fr,
          });
        });
        this.setState({ contexts: contextArray });
      }
    });
  };

  onQuestionsSave = () => {
    if (this.state.newContexts) {
      this.state.newContexts.forEach((context) => {
        db.doCreateContext(context).catch(() => console.log('Fehler beim Speichern vom Context', context));
      });
    }
    db.doCreateQuestions(this.props.match.params.projectId, this.state.data).then(() =>
      this.setState(() => ({ editedData: false })));
  };

  onQuestionsDelete = () => {
    db.doRemoveQuestions(this.props.match.params.projectId).then(() =>
      this.setState(() => ({ data: {} })));
  };

  showModal = () => this.setState({ open: true });
  closeModal = () => {
    this.setState({ open: false });
  };

  importFromTemplate = questions => this.setState({ data: questions, editedData: true });

  handleFileUpload = (data, encoding) => {
    const file = data.target.files[0];
    const reader = new FileReader();
    reader.onload = (() => (
      (e) => {
        Parser.checkCSVColumnCount(e.target.result, 16).then((isCorrect) => {
          if (!isCorrect) {
            alert('Bitte prüfen Sie, dass Sie die richtige Vorlage verwenden');
          } else {
            Parser.parseContextes(e.target.result).then((contexts) => {
              const newContexts = [];
              contexts.forEach((context) => {
                if (this.state.contexts.filter(existingContext => existingContext.id === context.id
                  || existingContext.de === context.de).length === 0) {
                  if (context.id === '') {
                    newContexts.push({ ...context, id: context.de });
                  } else {
                    newContexts.push(context);
                  }
                }
              });
              this.setState(() => ({ newContexts }));
            });
            Parser.parseQuestions(e.target.result, this.state.contexts).then((questions) => {
              if (questions) {
                this.setState(() => ({
                  data: parseQuestionsToState(questions),
                  editedData: true,
                }));
              }
            });
          }
        });
      }
    ))(file);
    reader.readAsText(file, encoding);
  };

  render() {
    const {
      data,
      open,
      newContexts,
    } = this.state;
    return (
      <React.Fragment>
        <Header floated="left" as="h1">Fragebogen</Header>
        {(Object.keys(data).length > 0)
          ?
            <div>
              {this.state.editedData &&
              <Button
                color="green"
                onClick={() => this.onQuestionsSave()}
              >Fragen speichern
              </Button>
            }
              <Button.Group size="tiny" basic floated="right">
                <Button basic onClick={() => this.onQuestionsDelete()}>Löschen</Button>
                {!this.state.editedData &&
                <Button basic onClick={() => this.showModal()}>als Template speichern</Button>
              }
              </Button.Group>
              <TemplateModal open={open} closeModal={this.closeModal} data={data} />
              <AdminDataContext.Consumer>
                {adminData => (adminData && adminData.contexts
                ? <QuestionList data={data} adminData={adminData} newContexts={newContexts} />
                : null)
              }
              </AdminDataContext.Consumer>
            </div>
          : <NoQuestions
            importFromTemplate={this.importFromTemplate}
            handleFileUpload={this.handleFileUpload}
          />
        }
      </React.Fragment>
    );
  }
}

const dbFunction = db.onceGetQuestions;
export default withLoader(dbFunction, 'projectId')(Questions);

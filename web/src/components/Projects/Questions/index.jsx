import React from 'react';
import { PropTypes } from 'prop-types';
import withLoader from 'components/withLoader';
import { Button, Header } from 'semantic-ui-react';

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
    };
  }
  onQuestionsSave = () => {
    db.doCreateQuestions(this.props.match.params.projectId, this.state.data).then(() =>
      this.setState(() => ({ editedData: false })));
  }
  onQuestionsDelete = () => {
    db.doRemoveQuestions(this.props.match.params.projectId).then(() =>
      this.setState(() => ({ data: {} })));
  }

  showModal = () => this.setState({ open: true })
  closeModal = () => {
    this.setState({ open: false });
  }

  importFromTemplate = questions => this.setState({ data: questions, editedData: true });

  handleFileUpload = (data) => {
    const file = data.target.files[0];
    const reader = new FileReader();
    reader.onload = (() => (
      (e) => {
        Parser.parseQuestions(e.target.result).then((questions) => {
          if (questions) {
            this.setState(() => ({
              data: parseQuestionsToState(questions),
              editedData: true,
            }));
          }
        });
      }
    ))(file);
    reader.readAsText(file);
  }
  render() {
    const {
      data,
      open,
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
              <QuestionList data={data} />
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

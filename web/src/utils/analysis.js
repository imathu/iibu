import idx from 'idx';
import { getAllContextIds } from 'utils/question';

const unique = array => (
  array.filter((v, i, a) => a.indexOf(v) === i)
);

const chartColor = [
  'rgba(27,133,184,0.9)',
  'rgba(90,82,85,0.9)',
  'rgba(85,158,131,0.9)',
  'rgba(174,90,65,0.9)',
  'rgba(195,203,113,0.9)',
  'rgba(27,133,184,0.7)',
  'rgba(90,82,85,0.7)',
  'rgba(85,158,131,0.7)',
  'rgba(174,90,65,0.7)',
  'rgba(195,203,113,0.7)',
];

const createBarData = (labels, data) => ({
  labels,
  datasets: [{
    label: '# of Votes',
    data,
    borderWidth: 1,
    backgroundColor: chartColor,
  }],
});

const createRadarData = (labels, foreign, self) => ({
  labels,
  datasets: [{
    label: 'foreign',
    data: foreign,
    borderWidth: 3,
    borderColor: chartColor[1],
  }, {
    label: 'self',
    data: self,
    borderWidth: 3,
    borderColor: chartColor[4],
  }],
});

export const getDataByRoleAndContext = (clientId, data, adminData, contextId, lang='de') => {
  return createBarData(['vorgesetzter', 'ich', 'kollege'], [3, 4, 2]);
};

export class Analysis {
  constructor(project, adminData) {
    this.project = project;
    this.adminData = adminData;
    this.feedbackers = Object.keys(project.feedbackers)
      .map(f => ({ id: f, ...project.feedbackers[f] }));
    this.contexts = getAllContextIds(project.questions);
    this.questionList = idx(project, _ => _.questions) || {};
  }

  static getAnswersByContext(answers, contextId) {
    const filteredAnswers = answers.filter(a => a.context === contextId);
    const sum = filteredAnswers.reduce((acc, val) => (acc + val.score), 0);
    return (sum > 0) ? sum / filteredAnswers.length : 0;
  }

  getRadarData(clientId) {
    const answers = this.getAnswersByClient(clientId);
    const foreign = [];
    const self = [];
    const contexts = answers.map(a => a.context);
    // self answers
    unique(contexts).forEach(context =>
      self.push(Analysis.getAnswersByContext(answers.filter(a => a.role === 'self'), context)));

    // foreign answers
    unique(contexts).forEach(context =>
      foreign.push(Analysis.getAnswersByContext(answers.filter(a => (a.role && a.role !== 'self')), context)));

    const labels = contexts.filter((v, i, a) => a.indexOf(v) === i);
    return createRadarData(labels, foreign, self);
  }

  getAnswersByClient(clientId) {
    const answers = [];
    Object.keys(this.questionList).forEach((qId) => {
      this.feedbackers.forEach((feedbacker) => {
        if (feedbacker.clients[clientId]) {
          const role = idx(feedbacker, _ => _.clients[clientId].role) || 'n/a';
          const answer = idx(feedbacker, _ => _.clients[clientId].answers[qId]) || null;
          if (answer) {
            answers.push({
              questionId: qId,
              context: this.questionList[qId].context,
              feedbackerId: feedbacker.id,
              role,
              score: answer.score,
            });
          }
        } else {
          answers.push({
            questionId: qId,
            context: this.questionList[qId].context,
            feedbackerId: feedbacker.id,
            role: null,
            score: 0,
          });
        }
      });
    });
    return (answers);
  }
}

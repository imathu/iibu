import idx from 'idx';
import { getContextById } from 'utils/context';
import { getRoleById } from 'utils/roles';

function fix(x) {
  return Number.parseFloat(x).toFixed(2);
}


const unique = array => (
  array.filter((v, i, a) => a.indexOf(v) === i)
);

const chartColor = [
  'rgba(27,133,184,0.8)',
  'rgba(90,82,85,0.8)',
  'rgba(85,158,131,0.8)',
  'rgba(174,90,65,0.8)',
  'rgba(195,203,113,0.8)',
  'rgba(27,133,184,0.9)',
  'rgba(90,82,85,1)',
  'rgba(85,158,131,1)',
  'rgba(174,90,65,1)',
  'rgba(195,203,113,1)',
];

const createBarData = (labels, data, min, max) => ({
  labels,
  datasets: [{
    label: 'max',
    data: max,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    lineTension: '0.3',
    showLine: false, // no line shown
    pointRadius: 5,
    pointHoverRadius: 8,
  }, {
    label: 'min',
    data: min,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    showLine: false, // no line shown
    pointRadius: 5,
    pointHoverRadius: 8,
  }, {
    label: 'Votes',
    data,
    borderWidth: 1,
    backgroundColor: chartColor,
    type: 'bar',
  }],
});

const createLineData = (labels, data, min, max) => ({
  labels,
  datasets: [{
    label: 'Votes',
    data,
    type: 'line',
    borderColor: chartColor[0],
    borderWidth: 1,
  }, {
    label: 'max',
    data: max,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    lineTension: '0.3',
  }, {
    label: 'min',
    data: min,
    type: 'line',
    borderColor: chartColor[3],
    borderWidth: 1,
  }],
});


const createRadarData = (labels, foreign, self) => ({
  labels,
  datasets: [{
    label: 'foreign',
    data: foreign,
    borderWidth: 3,
    borderColor: chartColor[5],
  }, {
    label: 'self',
    data: self,
    borderWidth: 3,
    borderColor: chartColor[9],
  }],
});

export class Analysis {
  constructor(project, adminData) {
    this.project = project;
    this.adminData = adminData;
    this.feedbackers = Object.keys(project.feedbackers)
      .map(f => ({ id: f, ...project.feedbackers[f] }));
    this.roleIds = Object.keys(adminData.roles);
    this.roles = adminData.roles;
    this.contextIds = Object.keys(adminData.contexts);
    this.contexts = adminData.contexts;
    this.questionList = idx(project, _ => _.questions) || {};
  }

  // return the average for each answer by context
  static getAnswersByContext(answers, contextId) {
    const filteredAnswers = answers.filter(a => a.context === contextId);
    const sum = filteredAnswers.reduce((acc, val) => (acc + val.score), 0);
    return (sum > 0) ? sum / filteredAnswers.length : 0;
  }

  // return the average for an answer by role
  static getAnswerByRole(answers, roleId) {
    const filteredAnswers = answers.filter(a => a.role === roleId);
    const feedbackers = unique(filteredAnswers.map(a => a.feedbackerId)).length;
    const filteredArray = filteredAnswers.map(a => a.score);
    const sum = filteredArray.reduce((acc, val) => (acc + val), 0);
    const avg = (sum > 0) ? sum / filteredArray.length : 0;
    const max = filteredArray.reduce((a, b) => Math.max(a, b), 0);
    const min = filteredArray.reduce((a, b) => Math.min(a, b), 1000);
    return ({
      avg,
      max,
      min: (min >= 1000) ? 0 : min,
      feedbackers,
    });
  }

  getBarData(contextId, clientId, line = false) {
    const answers = this.getAnswersByClient(clientId);
    const answersByContext = answers.filter(answer => answer.context === contextId);
    const { roleIds } = this;
    const values = [];
    const mins = [];
    const maxs = [];
    const feedbackers = [];
    this.roleIds.forEach((roleId) => {
      const value = Analysis.getAnswerByRole(answersByContext, roleId);
      values.push(fix(value.avg));
      mins.push(value.min);
      maxs.push(value.max);
      feedbackers.push(value.feedbackers);
    });
    if (line) return createLineData(roleIds.map((id, i) => `${getRoleById(this.roles, id)} (${feedbackers[i]})`), values, mins, maxs);
    return createBarData(roleIds.map((id, i) => `${getRoleById(this.roles, id)} (${feedbackers[i]})`), values, mins, maxs);
  }

  getRadarData(clientId) {
    const answers = this.getAnswersByClient(clientId);
    const foreign = [];
    const self = [];
    const contexts = answers.map(a => a.context);
    // self answers
    unique(contexts).forEach(context =>
      self.push(fix(Analysis.getAnswersByContext(answers.filter(a => a.role === 'self'), context))));
    // foreign answers
    unique(contexts).forEach(context =>
      foreign.push(fix(Analysis.getAnswersByContext(answers.filter(a => (a.role && a.role !== 'self')), context))));
    const labels = contexts.filter((v, i, a) => a.indexOf(v) === i);
    return createRadarData(labels.map(l => getContextById(this.contexts, l)), foreign, self);
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

export default Analysis;

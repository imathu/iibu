import idx from 'idx';
import { getContextById } from 'utils/context';
import { getRoleById } from 'utils/roles';
import { getSD } from 'utils/Analysis/index';

import { getLanguage } from 'utils/language';

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

export const color10 = [
  'rgba(27,133,184,1)',
  'rgba(90,82,85,1)',
  'rgba(85,158,131,1)',
  'rgba(174,90,65,1)',
  'rgba(195,203,113,1)',
];

export const barChartByQuestion = (labels, data, sds) => ({
  labels,
  datasets: [{
    label: 'Votes',
    data,
    borderWidth: 1,
    backgroundColor: chartColor,
    type: 'horizontalBar',
  }, {
    label: 'Deviation',
    hidden: true,
    data,
    sds,
    backgroundColor: chartColor,
    type: 'horizontalBar',
    datalabels: {
      formatter: (value, context) => (
        (value, `+/- ${context.dataset.sds[context.dataIndex]}`)
      ),
    },
  }],
});

const createBarPerContext = (labels, data, min, max) => ({
  labels,
  datasets: [{
    label: 'sd',
    data: max,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    lineTension: '0.3',
    showLine: false, // no line shown
    pointRadius: 5,
    pointHoverRadius: 8,
  }, {
    label: 'sd',
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

const radarLabel = (l) => {
  const lang = getLanguage();
  if (l === 'foreign') {
    return (lang === 'en') ? 'external assessment' : 'Fremdeinschätzung';
  }
  return (lang === 'en') ? 'self-assessment' : 'Selbsteinschätzung';
};

const createRadarData = (labels, foreign, self) => ({
  labels,
  datasets: [{
    label: radarLabel('foreign'),
    data: foreign,
    borderWidth: 3,
    borderColor: chartColor[5],
  }, {
    label: radarLabel('self'),
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
    const filteredAnswers = answers.filter(a => a.context === contextId && a.score > 0);
    const sum = filteredAnswers.reduce((acc, val) => (acc + val.score), 0);
    return (sum > 0) ? sum / filteredAnswers.length : 0;
  }

  // return the average for an answer by role
  static getAnswerByRole(answers, roleId) {
    const filteredAnswers = answers.filter(a => a.role === roleId && a.score > 0);
    const feedbackers = unique(filteredAnswers.map(a => a.feedbackerId)).length;
    const filteredArray = filteredAnswers.map(a => a.score);
    const sum = filteredArray.reduce((acc, val) => (acc + val), 0);
    const avg = (sum > 0) ? sum / filteredArray.length : 0;
    const sd = (filteredArray.length > 1) ? getSD(filteredArray) : 0;
    return ({
      avg,
      max: avg + sd,
      min: avg - sd,
      sd,
      feedbackers,
    });
  }

  getBarByQuestion(contextId, questionId, clientId) {
    const answers = this.getAnswersByClient(clientId);
    const answersByContext = answers.filter(a =>
      ((a.questionId === questionId) && (a.context === contextId)));
    const values = [];
    const sds = [];
    const feedbackers = [];
    const labels = [];
    const remarks = answersByContext
      .filter(a => a.remark !== undefined)
      .map(a => ({ questionId: a.questionId, feedbackerId: a.feedbackerId, remark: `- ${a.remark}` }));
    this.roleIds.forEach((roleId) => {
      const value = Analysis.getAnswerByRole(answersByContext, roleId);
      if (value.avg > 0) {
        values.push(fix(value.avg));
        feedbackers.push(value.feedbackers);
        sds.push(fix(value.sd));
        labels.push(roleId);
      }
    });
    // removeByIndexes(sds, zeroIdx);
    return ({
      barData: barChartByQuestion(labels.map((id, i) => `${getRoleById(this.roles, id)} (${feedbackers[i]})`), values, sds),
      remarks,
    });
  }

  getBarData(contextId, clientId, line = false) {
    const answers = this.getAnswersByClient(clientId);
    const answersByContext = answers.filter(answer => answer.context === contextId);
    const values = [];
    const mins = [];
    const maxs = [];
    const feedbackers = [];
    const labels = [];
    this.roleIds.forEach((roleId) => {
      const value = Analysis.getAnswerByRole(answersByContext, roleId);
      if (value.avg > 0) {
        values.push(fix(value.avg));
        mins.push(value.min);
        maxs.push(value.max);
        feedbackers.push(value.feedbackers);
        labels.push(roleId);
      }
    });
    if (line) return createLineData(labels.map((id, i) => `${getRoleById(this.roles, id)} (${feedbackers[i]})`), values, mins, maxs);
    return createBarPerContext(labels.map((id, i) => `${getRoleById(this.roles, id)} (${feedbackers[i]})`), values, mins, maxs);
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
              remark: answer.remark,
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

import idx from 'idx';

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

// return an array of answers
const getAnswers = (feedbacker, clientId) => {
  const answers = idx(feedbacker, _ => _.clients[clientId].answers) || {};
  return Object.keys(answers).map(id => ({ id, score: answers[id].score }));
};

const getAllFeedbackersContextIds = (clientId, data) => {
  const contextIds = [];
  const { feedbackers } = data;
  Object.keys(feedbackers).forEach((feedbackerId) => {
    const answers = getAnswers(feedbackers[feedbackerId], clientId);
    answers.forEach((answer) => {
      const contextId = idx(data, _ => _.questions[answer.id].context) || '';
      if (!contextIds[contextId]) contextIds.push(contextId);
    });
  });
  return unique(contextIds);
};

export const getDataByContext = (clientId, data, adminData) => {
  console.log(getAllFeedbackersContextIds(clientId, data));
  return createRadarData(['a', 'b', 'c', 'd'], [2, 3, 4, 2], [3, 2, 5, 3]);
};

export const getDataByRoleAndContext = (clientId, data, adminData, contextId, lang='de') => {
  // console.log('data', data);
  // console.log('adminData', adminData);
  return createBarData(['vorgesetzter', 'ich', 'kollege'], [3, 4, 2]);
};

export default getDataByRoleAndContext;

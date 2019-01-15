import idx from 'idx';

import { getLanguage } from './language';

export const getQuestionContent = (question, person, name = null) => {
  const language = getLanguage();
  let str = idx(question, _ => _.content[language][person]) || 'n/a';
  if (name) {
    str = `${name} ${str}`;
  }
  return str;
};

export const getAllContextIds = (questions) => {
  const contexts = Object.keys(questions).map(qId => questions[qId].context);
  return contexts.filter((v, i, a) => a.indexOf(v) === i);
};

export default getQuestionContent;

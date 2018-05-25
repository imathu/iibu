import idx from 'idx';

import { getLanguage } from './language';

export const getQuestionContent = (question, person) => {
  const language = getLanguage();
  return idx(question, _ => _.content[language][person]) || 'n/a';
};

export default getQuestionContent;

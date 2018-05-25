import idx from 'idx';

import { getLanguage } from './language';

export const getContextById = (contexts, id, lang) => {
  const language = (!lang) ? getLanguage() : lang;
  return idx(contexts, _ => _[id][language]) || 'n/a';
};

export default getContextById;

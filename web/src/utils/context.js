import idx from 'idx';

import { getLanguage } from './language';

export const getContextById = (contexts, id, lang, returnIdIfNotFound = false) => {
  const language = (!lang) ? getLanguage() : lang;
  if (returnIdIfNotFound) {
    return idx(contexts, _ => _[id][language]) || (id ? (`** NEU: ${id} **`) : 'NICHT GEFUNDEN!');
  }
  return idx(contexts, _ => _[id][language]) || 'n/a';
};

export default getContextById;

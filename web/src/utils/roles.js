import idx from 'idx';

import { getLanguage } from './language';

export const getRoleById = (roles, id, lang) => {
  const language = (!lang) ? getLanguage() : lang;
  return idx(roles, _ => _[id][language]) || 'n/a';
};

export default getRoleById;

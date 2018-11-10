import idx from 'idx';
import Parser from './parser';
import { getLanguage } from './language';

export function importQuestions(data) {
  const file = data.target.files[0];
  const reader = new FileReader();
  reader.onload = (() => (
    (e) => {
      Parser.parseQuestions(e.target.result).then((questions) => {
        const list = {};
        questions.forEach((q) => { list[q.id] = q; });
        return list;
      });
    }
  ))(file);
  reader.readAsText(file);
}

export const getRoleCode = (roleId, gender) => {
  if (roleId === 'self') return 'me';
  if (gender === 'w') return 'she';
  return 'he';
};

export function getRoleContent(roles, roleId) {
  const lang = getLanguage();
  return idx(roles, _ => _[roleId][lang]) || 'undefined role';
}

export const getRolePhraseStart = (roles, id, gender) => {
  const lang = getLanguage();
  return idx(roles, _ => _[id].phraseStart[gender][lang]) || '';
};

export function getURL() {
  return process.env.REACT_APP_URL || 'http://localhost:3000';
}

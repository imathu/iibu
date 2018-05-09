import Parser from './parser';

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

export default importQuestions;

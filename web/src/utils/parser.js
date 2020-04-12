import csv from 'csvtojson';
import uuidv4 from 'uuid/v4';

const questionCSVMap = {
  context_de: 0,
  contextDescription_de: 1,
  he_de: 2,
  heCount_de: 3,
  she_de: 4,
  sheCount_de: 5,
  me_de: 6,
  meCount_de: 7,
  context_en: 8,
  contextDescription_en: 9,
  he_en: 10,
  heCount_en: 11,
  she_en: 12,
  sheCount_en: 13,
  me_en: 14,
  meCount_en: 15,
};

const clientCSVMap = {
  role: 0,
  fb_nehmer_firstname: 1,
  fb_nehmer_name: 2,
  firstname: 3,
  name: 4,
  gender: 5,
  mail: 6,
};

const createClient = line => ({
  id: uuidv4(),
  firstname: (line[clientCSVMap.firstname]),
  name: (line[clientCSVMap.name]),
  gender: (line[clientCSVMap.gender]),
  email: (line[clientCSVMap.mail]),
  role: '',
});

const createFeedbacker = (line, role) => ({
  id: uuidv4(),
  firstname: (line[clientCSVMap.firstname]),
  name: (line[clientCSVMap.name]),
  gender: ((line[clientCSVMap.gender])).toLowerCase(),
  email: (line[clientCSVMap.mail]),
  role: (!role) ? ((line[clientCSVMap.role])).toLowerCase() : role.toLowerCase(),
});

const addFeedbacker = (feedbackerArray, feedbacker, clientId) => {
  const feedbackers = feedbackerArray;
  let fdbk = feedbackerArray.find(f => f.email === feedbacker.email);
  if (fdbk !== undefined) {
    // a feedbacker with given mail already exists, Just add a new client Id
    feedbackers.map((f) => {
      if (f.email === feedbacker.email) {
        const newFeedbacker = f;
        newFeedbacker.clients = Object.assign({}, newFeedbacker.clients, {
          ...newFeedbacker.clients,
          [clientId]: {
            id: clientId,
            role: (feedbacker.role).toLowerCase(),
          },
        });
        return newFeedbacker;
      }
      return f;
    });
  } else {
    // a feedbacker with the given mail does not exists, add a new feedbacker
    fdbk = {
      id: uuidv4(),
      email: feedbacker.email,
      gender: (feedbacker.gender).toLowerCase(),
      clients: {
        [clientId]: {
          id: clientId,
          role: (feedbacker.role).toLowerCase(),
        },
      },
    };
    feedbackers.push(fdbk);
  }
  return feedbackers;
};

const feedbackersToObject = (feedbackers) => {
  const f = {};
  feedbackers.forEach((feedbacker) => {
    f[feedbacker.id] = {};
    f[feedbacker.id] = feedbacker;
  });
  return f;
};

// parse the list of clients and feedbackers to JSON
// return an object containing an array of clients and an array of feedbackers
export function feedbackerCSV2JJSON(feedbackerArray) {
  let clients = {};
  let clientId = -1;
  let feedbackers = [];
  feedbackerArray.forEach((line) => {
    if (line[clientCSVMap.firstname] !== '') {
      if ((line[clientCSVMap.role]).toLowerCase() === 'selbsteinschätzung') {
        // add a new client
        const client = createClient(line);
        clients = {
          ...clients,
          [client.id]: client,
        };
        clientId = client.id;
        feedbackers = addFeedbacker(feedbackers, createFeedbacker(line, 'self'), clientId);
      } else {
        // add a new feedbacker to the current client
        feedbackers = addFeedbacker(feedbackers, createFeedbacker(line), clientId);
      }
    }
  });
  return { clients, feedbackers: feedbackersToObject(feedbackers) };
}

// parse a CSV string of questionaires to json
// return an isArray
export function questionCSV2json(questionArray, contexts) {
  const questions = [];
  questionArray.forEach((line, index) => {
    let contextFound;
    if (line[questionCSVMap.context_de] === '') {
      const filterContext =
        contexts.filter(existingContext =>
          existingContext.de === line[questionCSVMap.contextDescription_de]);
      if (filterContext.length > 0) {
        [contextFound] = filterContext;
      }
    }

    if (line[questionCSVMap.context_de] !== '' || line[questionCSVMap.contextDescription_de] !== '') {
      let contextForQuestion;
      if (line[questionCSVMap.context_de] !== '') {
        contextForQuestion = line[questionCSVMap.context_de];
      } else {
        contextForQuestion = (contextFound && (contextFound.id)) ?
          (contextFound.id) : line[questionCSVMap.contextDescription_de];
      }

      const question = {
        id: `id-${index}`,
        scores: 6,
        context: contextForQuestion,
        content: {
          de: {
            he: (line[questionCSVMap.he_de] === '') ? line[questionCSVMap.she_de] : line[questionCSVMap.he_de],
            she: (line[questionCSVMap.she_de] === '') ? line[questionCSVMap.he_de] : line[questionCSVMap.she_de],
            me: line[questionCSVMap.me_de],
          },
          en: {
            he: (line[questionCSVMap.he_en] === '') ? line[questionCSVMap.she_en] : line[questionCSVMap.he_en],
            she: (line[questionCSVMap.she_en] === '') ? line[questionCSVMap.he_en] : line[questionCSVMap.she_en],
            me: line[questionCSVMap.me_en],
          },
        },
      };
      questions.push(question);
    }
  });
  return questions;
}

export function questionCSV2Context(questionArray) {
  const contexts = [];

  questionArray.forEach((line) => {
    if (line[questionCSVMap.context_de] !== '' || line[questionCSVMap.contextDescription_de] !== '' || line[questionCSVMap.contextDescription_en]) {
      const newContext = {
        id: line[questionCSVMap.context_de],
        de: line[questionCSVMap.contextDescription_de],
        en: line[questionCSVMap.contextDescription_en],
        fr: '',
      };

      if (!(contexts.filter(foundContext => foundContext.de === newContext.de).length > 0)) {
        contexts.push(newContext);
      }
    }
  });

  return contexts;
}

class Parser {
  // return an object with a client array and a feedbacker array
  static parseClients(input) {
    return new Promise(((resolve, reject) => {
      const feedbackers = [];
      csv({ noheader: false, delimiter: 'auto' })
        .fromString(input)
        .on('csv', (csvRow) => {
          feedbackers.push(csvRow);
        })
        .on('done', (error) => {
          if (error) {
            return reject(new Error('CSV File invalid'));
          }
          return resolve(feedbackerCSV2JJSON(feedbackers));
        });
    }));
  }

  // return an array of question objects
  static parseQuestions(input, contexts) {
    return new Promise(((resolve, reject) => {
      const questions = [];
      csv({ noheader: false, delimiter: 'auto' })
        .fromString(input)
        .on('csv', (csvRow) => {
          questions.push(csvRow);
        })
        .on('done', (error) => {
          if (error) {
            return reject(new Error('CSV File invalid'));
          }
          return resolve(questionCSV2json(questions, contexts));
        });
    }));
  }

  // return an array of contextes found in questions csv
  static parseContextes(input) {
    return new Promise(((resolve, reject) => {
      const questions = [];
      csv({ noheader: false, delimiter: 'auto' })
        .fromString(input)
        .on('csv', (csvRow) => {
          questions.push(csvRow);
        })
        .on('done', (error) => {
          if (error) {
            return reject(new Error('CSV File invalid'));
          }
          return resolve(questionCSV2Context(questions));
        });
    }));
  }

  static checkCSVColumnCount(input, count) {
    return new Promise(((resolve, reject) => {
      const questions = [];
      csv({ noheader: false, delimiter: 'auto' })
        .fromString(input)
        .on('csv', (csvRow) => {
          questions.push(csvRow);
        })
        .on('done', (error) => {
          if (error) {
            return reject(new Error('CSV File invalid'));
          }
          let valueToReturn = false;
          if (questions[0] && questions[0].length === count) {
            valueToReturn = true;
          }
          return resolve(valueToReturn);
        });
    }));
  }
}

export default Parser;

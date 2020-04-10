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

const CSVMap = {
  firstname: 10,
  name: 11,
  gender: 12,
  mail: 13,
  role: 4,
};

const clientCSVMap = {
  status: 0,
  index: 1,
  number: 2,
  feedbackId: 3,
  status_einschaetzung: 4,
  status_i: 5,
  fb_nehmer_vorname: 6,
  fb_nehmer_name: 7,
  fb_nehmer_geschlecht: 8,
  fb_nehmer_mail: 9,
  fb_geber_vorname: 10,
  fb_geber_name: 11,
  fb_geber_geschlecht: 12,
  fb_geber_mail: 13,
  benutzername: 14,
  passwort: 15,
};

const createClient = line => ({
  id: uuidv4(),
  firstname: (line[CSVMap.firstname]),
  name: (line[CSVMap.name]),
  gender: (line[CSVMap.gender]),
  email: (line[CSVMap.mail]),
  role: '',
});

const createFeedbacker = (line, role) => ({
  id: uuidv4(),
  firstname: (line[CSVMap.firstname]),
  name: (line[CSVMap.name]),
  gender: ((line[CSVMap.gender])).toLowerCase(),
  email: (line[CSVMap.mail]),
  role: (!role) ? ((line[CSVMap.role])).toLowerCase() : role.toLowerCase(),
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
    if (line[10] !== '') {
      if ((line[4]).toLowerCase() === 'selbsteinschätzung') {
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
export function questionCSV2json(questionArray) {
  const questions = [];
  questionArray.forEach((line, index) => {
    if (line[questionCSVMap.context_de] !== '') {
      const question = {
        id: `id-${index}`,
        scores: 6,
        context: line[questionCSVMap.context_de],
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
    const context = {
      id: line[questionCSVMap.context_de],
      de: line[questionCSVMap.contextDescription_de],
      en: line[questionCSVMap.contextDescription_en],
      fr: '',
    };

    if (!(contexts.filter(cont => cont.de === context.de).length > 0)) {
      contexts.push(context);
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
  static parseQuestions(input) {
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
          return resolve(questionCSV2json(questions));
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
}

export default Parser;

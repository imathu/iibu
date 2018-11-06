import csv from 'csvtojson';
import uuidv4 from 'uuid/v4';

const CSVMap = {
  firstname: 10,
  name: 11,
  gender: 12,
  mail: 13,
  role: 4,
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
function feedbackerCSV2JJSON(feedbackerArray) {
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
function questionCSV2json(questionArray) {
  const questions = [];
  questionArray.forEach((line, index) => {
    if (line[2] !== '') {
      const question = {
        id: `id-${index}`,
        scores: 5,
        context: line[2],
        content: {
          de: {
            he: (line[5] === '') ? line[7] : line[5],
            she: (line[7] === '') ? line[5] : line[7],
            me: line[9],
          },
          en: {
            he: (line[16] === '') ? line[18] : line[16],
            she: (line[18] === '') ? line[16] : line[18],
            me: line[20],
          },
        },
      };
      questions.push(question);
    }
  });
  return questions;
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
}

export default Parser;

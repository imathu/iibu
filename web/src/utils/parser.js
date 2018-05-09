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
  firstname: line[CSVMap.firstname],
  name: line[CSVMap.name],
  gender: line[CSVMap.gender],
  mail: line[CSVMap.mail],
  role: '',
});

const createFeedbacker = (line, role) => ({
  id: uuidv4(),
  firstname: line[CSVMap.firstname],
  name: line[CSVMap.name],
  gender: line[CSVMap.gender],
  mail: line[CSVMap.mail],
  role: (!role) ? line[CSVMap.role] : role,
});

const addFeedbacker = (feedbackerArray, feedbacker, procId, clientId) => {
  const feedbackers = feedbackerArray;
  let fdbk = feedbackerArray.find(f => f.mail === feedbacker.mail);
  if (fdbk !== undefined) {
    // a feedbacker with given mail already exists, Just add a new client Id
    feedbackers.map((f) => {
      if (f.mail === feedbacker.mail) {
        const newFeedbacker = f;
        newFeedbacker.clients = Object.assign({}, newFeedbacker.clients, {
          ...newFeedbacker.clients,
          [clientId]: {
            id: clientId,
            role: feedbacker.role,
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
      mail: feedbacker.mail,
      proc: procId,
      gender: feedbacker.gender,
      clients: {
        [clientId]: {
          id: clientId,
          role: feedbacker.role,
        },
      },
    };
    feedbackers.push(fdbk);
  }
  return feedbackers;
};

// parse the list of clients and feedbackers to JSON
// return an object containing an array of clients and an array of feedbackers
function feedbackerCSV2JJSON(feedbackerArray, procId) {
  const clients = [];
  let clientId = -1;
  let feedbackers = [];
  feedbackerArray.forEach((line) => {
    if (line[10] !== '') {
      if (line[4] === 'Selbsteinschätzung') {
        // add a new client
        const client = createClient(line);
        clients.push(client);
        clientId = client.id;
        feedbackers = addFeedbacker(feedbackers, createFeedbacker(line, 'self'), procId, clientId);
      } else {
        // add a new feedbacker to the current client
        feedbackers = addFeedbacker(feedbackers, createFeedbacker(line), procId, clientId);
      }
    }
  });
  return { clients, feedbackers };
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
  static parseClients(input, procId) {
    return new Promise(((resolve, reject) => {
      const feedbackers = [];
      csv({ noheader: false })
        .fromString(input)
        .on('csv', (csvRow) => {
          feedbackers.push(csvRow);
        })
        .on('done', (error) => {
          if (error) {
            return reject(new Error('CSV File invalid'));
          }
          return resolve(feedbackerCSV2JJSON(feedbackers, procId));
        });
    }));
  }

  // return an array of question objects
  static parseQuestions(input) {
    return new Promise(((resolve, reject) => {
      const questions = [];
      csv({ noheader: false })
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

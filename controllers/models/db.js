const admin = require('firebase-admin');
const serviceAccount = require('./../../config/firebase-auth-0d67b9a393cc.json'); // eslint-disable-line
const logger = require('./../../util');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-auth-96d6b.firebaseio.com/',
});

const db = admin.database();
logger.consoleLogger('Connected to database');

module.exports = {
  db,
};

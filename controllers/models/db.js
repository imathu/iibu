const admin = require('firebase-admin');
const config = require('config');
const logger = require('./../../util');

const getFBAccount = () => {
  let fbToken = '';
  if (process.env.FB_TOKEN) {
    // if a firebase token can be found in an environment variable, use it
    return JSON.parse(Buffer.from(process.env.FB_TOKEN, 'base64').toString());
  }
  try {
    fbToken = require(`./${config.firebaseToken}`); // eslint-disable-line
  } catch (e) {
    console.info('firebase token not found in config dir'); // eslint-disable-line no-console
  }
  if (fbToken && fbToken !== '') {
    // if a firbase token can be found in a config file, use it
    return fbToken;
  }
  console.error('firebase token not found, check your environment variables'); // eslint-disable-line no-console
  process.exit(1);
};

const getFBUrl = token => (
  `https://${token.project_id}.firebaseio.com`
);

const fbToken = getFBAccount();

// Setup firebase for persistent storage
admin.initializeApp({
  credential: admin.credential.cert(fbToken),
  databaseURL: getFBUrl(fbToken),
});

const db = admin.database();
logger.consoleLogger('Connected to database');

module.exports = {
  db,
};

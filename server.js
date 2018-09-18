const express = require('express');
const enforce = require('express-sslify');

const app = express();
if (process.env.NODE_ENV !== 'dev') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('./util');

const feedbacker = require('./controllers/routes/feedbacker');

// parse application/json and look for raw text
app.use('/api', bodyParser.json());
app.use('/api/', bodyParser.urlencoded({ extended: true }));
app.use('/api', bodyParser.text());
app.use('/api', bodyParser.json({ type: 'application/json' }));

app.use(logger.requestLogger);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'web/build')));

app.route('/api/v1/:projectId/answers/:feedbackerId')
  .get(feedbacker.getFeedbackerAnswers);

app.route('/api/v1/:projectId/mail')
  .post(feedbacker.sendMail);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/web/build/index.html`));
  console.log('sending: ', path.join(`${__dirname}/web/build/index.html`)); // eslint-disable-line no-console
});

const port = process.env.PORT || 3001;
const server = app.listen(port);

module.exports = server;

console.log(`iibu server listening on ${port}`); // eslint-disable-line no-console

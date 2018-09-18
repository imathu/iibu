const appState = require('./../models/app-state.js');

function getFeedbackerAnswers(req, res) {
  const idToken = req.get('Authorization');
  if (idToken) {
    appState.getFeedbackerAnswers(req.params.projectId, req.params.feedbackerId, idToken)
      .then((data) => {
        res.status(data.status);
        res.json(data.payload);
      });
  } else {
    res.status(403);
    res.json({});
  }
}

function sendMail(req, res) {
  const idToken = req.get('Authorization');
  if (idToken) {
    appState.sendMail(req.params.projectId, req.body, idToken)
      .then((data) => {
        res.status(data.status);
        res.json(data.payload);
      });
  } else {
    res.status(403);
    res.json({});
  }
}

module.exports = {
  getFeedbackerAnswers,
  sendMail,
};

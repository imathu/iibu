const appState = require('./../models/app-state.js');

function getFeedbackerAnswers(req, res) {
  appState.getFeedbackerAnswers(req.params.projectId, req.params.feedbackerId)
    .then((data) => {
      res.json(data);
    });
}

module.exports = {
  getFeedbackerAnswers,
};

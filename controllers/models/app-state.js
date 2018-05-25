const fb = require('./db');

const getContexts = () => (
  new Promise((resolve) => {
    fb.db.ref('contexts/').once('value')
      .then((snapshot) => {
        const contexts = snapshot.val();
        resolve(contexts);
      })
      .catch(() => resolve({}));
  })
);

const getRoles = () => (
  new Promise((resolve) => {
    fb.db.ref('roles').once('value')
      .then((snapshot) => {
        const roles = snapshot.val();
        resolve(roles);
      })
      .catch(() => resolve({}));
  })
);

const getProject = projectId => (
  new Promise((resolve) => {
    fb.db.ref(`projects/${projectId}`).once('value')
      .then((snapshot) => {
        const project = snapshot.val();
        resolve(project);
      })
      .catch(() => resolve({
        clients: {},
        questions: {},
        feedbackers: {},
      }));
  })
);

async function getFeedbackerAnswers(projectId, feedbackerId) {
  const contexts = await getContexts();
  const roles = await getRoles();
  const project = await getProject((projectId));
  return (project.feedbackers)
    ? {
      contexts,
      roles,
      clients: project.clients,
      questions: project.questions,
      feedbacker: project.feedbackers[feedbackerId],
    }
    : { err: 'feedbacker not found' };
}

module.exports = {
  getFeedbackerAnswers,
};

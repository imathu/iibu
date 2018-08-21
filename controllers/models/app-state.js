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

const verifyIdToken = idToken => (
  new Promise((resolve) => {
    fb.auth.verifyIdToken(idToken)
      .then(token => resolve(token.email))
      .catch(() => resolve(undefined));
  })
);

async function getFeedbackerAnswers(projectId, feedbackerId, idToken) {
  const email = await verifyIdToken(idToken);
  if (!email) {
    return {
      status: '500',
      payload: 'Could not verify your email',
    };
  }
  const res = {
    status: '403',
    payload: 'Forbidden',
  };
  const contexts = await getContexts();
  const roles = await getRoles();
  const project = await getProject((projectId));
  if (project.feedbackers) {
    const feedbacker = project.feedbackers[feedbackerId];
    if (feedbacker) {
      if (feedbacker.email === email) {
        return {
          status: '200',
          payload: {
            contexts,
            roles,
            clientBanner: project.clientBanner,
            languages: project.languages,
            clients: project.clients,
            questions: project.questions,
            feedbacker,
          },
        };
      }
    }
  }
  return res;
}

module.exports = {
  getFeedbackerAnswers,
};

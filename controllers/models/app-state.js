const fb = require('./db');
const logger = require('./../../util');
const Mail = require('./mail');

const RES_403 = {
  status: '403',
  payload: 'Forbidden',
};

const RES_500 = {
  status: '500',
  payload: 'Internal Server Error',
};

const mail = new Mail.Mail('hrmove');

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

const isAdmin = idToken => (
  new Promise((resolve) => {
    fb.auth.verifyIdToken(idToken)
      .then(token => resolve(token.admin))
      .catch(() => resolve(false));
  })
);

async function sendMail(company, projectId, payload, idToken) {
  const admin = await isAdmin(idToken);
  if (!admin) return RES_403;
  const { feedbackers } = payload;
  if (!(feedbackers && projectId)) return RES_500;

  const feedbacker1 = feedbackers[0];
  if (!feedbacker1) return RES_500;

  if (!mail.getCompany() === company) {
    mail.setCompany(company);
  }
  const transporter = mail.getTransporter();

  const okMails = [];
  const errMails = [];

  const t = await Promise.all(payload.feedbackers.map((feedbacker) => {
    const mailOptions = {
      from: process.env[mail.mail],
      to: feedbacker.emailAddress,
      subject: feedbacker.emailSubject,
      text: feedbacker.emailText,
    };
    return transporter.sendMail(mailOptions)
      .then((info) => {
        okMails.push(feedbacker.emailAddress);
        return new Promise(resolve => resolve(info));
      })
      .catch(() => {
        errMails.push(feedbacker.emailAddress);
      });
  }))
    .then(() => ({
      status: '200',
      payload: {
        okMails,
        errMails,
      },
    }))
    .catch(() => ({
      status: '200',
      payload: {
        okMails,
        errMails,
      },
    }));
  return (t);
}

async function getFeedbackerAnswers(projectId, feedbackerId, idToken) {
  const email = await verifyIdToken(idToken);
  if (!email) {
    logger.log(`feedbacker verification failed feedbacker=${feedbackerId} project=${projectId}`, 'error');
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
            company: project.company,
            feedbacker,
          },
        };
      }
      logger.log(`fetching feedbacker email, feedbacker=${feedbackerId} project=${projectId}`, 'error');
    }
    logger.log(`fetching feedbacker, feedbacker=${feedbackerId} project=${projectId}`, 'error');
  }
  logger.log(`fetching project feedbackers, feedbacker=${feedbackerId} project=${projectId}`, 'error');
  return res;
}

module.exports = {
  getFeedbackerAnswers,
  sendMail,
};

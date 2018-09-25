const fb = require('./db');
const nodemailer = require('nodemailer');


const RES_200 = {
  status: '200',
  payload: 'ok',
};

const RES_403 = {
  status: '403',
  payload: 'Forbidden',
};

const RES_500 = {
  status: '403',
  payload: 'Internal Server Error',
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PWD,
  },
});

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

async function sendMail(projectId, payload, idToken) {
  const admin = await isAdmin(idToken);
  if (!admin) return RES_403;
  const { feedbackers } = payload;
  if (!(feedbackers && projectId)) return RES_500;

  payload.feedbackers.forEach((feedbacker) => {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: feedbacker.emailAddress,
      subject: feedbacker.emailSubject,
      text: feedbacker.emailText,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error); // eslint-disable-line no-console
      } else {
        console.log('Message sent: %s', info.messageId); // eslint-disable-line no-console
      }
    });
  });
  return RES_200;
}

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
  sendMail,
};

import { db } from './firebase';

// User data
export const doCreateUser = (id, username, email) => db.ref(`users/${id}`).set({
  username,
  email,
});
export const doRemoveUser = id => db.ref(`users/${id}`).set({});
export const onceGetUsers = () => db.ref('users').once('value');

// Admin User
export const doCreateAdmin = id => db.ref(`admins/${id}`).set({
  admin: true,
});
export const doRemoveAdmin = id => db.ref(`admins/${id}`).set({});
export const isAdmin = id => db.ref(`admins/${id}`).once('value');
export const onceGetAdminUsers = () => db.ref('admins').once('value');

// Project data
export const onceGetProjects = () => (
  db.ref('projects').once('value')
);
export const onceGetProject = projectId => (
  db.ref(`projects/${projectId}`).once('value')
);
export const getProject = projectId => (
  db.ref(`projects/${projectId}`)
);
export const doRemoveProject = projectId => db.ref(`projects/${projectId}`).set({});
export const doUpdateProjectData = (projectId, project) => (
  db.ref(`projects/${projectId}`).update(({
    name: project.name,
    clientBanner: project.clientBanner,
    languages: project.languages,
  }))
);
export const doCreateProject = (projectId, project) => (
  db.ref('projects').push({
    name: project.name,
    clientBanner: project.clientBanner,
    clients: {},
    questions: {},
    feedbackers: {},
  })
);

// Role data
export const onceGetRoles = () => (
  db.ref('roles').once('value')
);

// Context data
export const onceGetContexts = () => (
  db.ref('contexts').once('value')
);

// feedbacker data
export const onceGetFeedbackers = projectId => (
  db.ref(`projects/${projectId}/feedbackers`).once('value')
);
export const onceGetFeedbacker = (projectId, feedbackerId) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}`).once('value')
);
export const doCreateFeedbackers = (projectId, feedbackers) => (
  db.ref(`projects/${projectId}/`).update({ feedbackers })
);
export const doUpdateFeedbacker = (projectId, data) => (
  db.ref(`projects/${projectId}/feedbackers/${data.id}`).update(data)
);
export const doUpdateAnswer = (projectId, feedbackerId, clientId, questionId, score) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}/clients/${clientId}/answers/${questionId}`).update({
    score,
  })
);
export const numAnswers = (projectId, feedbackerId, clientId) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}/clients/${clientId}/answers`)
);
export const doDisableBanner = (projectId, feedbackerId) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}`).update({ noBanner: true })
);

// Client data
export const onceGetClient = (projectId, clientId) => (
  db.ref(`projects/${projectId}/clients/${clientId}`).once('value')
);
export const onceGetClients = projectId => (
  db.ref(`projects/${projectId}/clients`).once('value')
);
export const doSaveClient = (projectId, client) => (
  db.ref(`projects/${projectId}/clients/${client.id}`).update({
    name: client.name,
    firstname: client.firstname,
    email: client.email,
    gender: client.gender,
  })
);
export const doCreateClients = (projectId, clients) => (
  db.ref(`projects/${projectId}/`).update({ clients })
);

// Question data
export const onceGetQuestions = projectId => (
  db.ref(`projects/${projectId}/questions`).once('value')
);
export const doRemoveQuestions = projectId =>
  db.ref(`projects/${projectId}/questions`).set({});
export const doCreateQuestions = (projectId, questions) => (
  db.ref(`/projects/${projectId}/`).update({ questions })
);


// template data
export const doCreateTemplate = (title, description, questions) => (
  db.ref('/templates/').push({
    title,
    questions,
    description,
  })
);
export const onceGetTemplates = () => (
  db.ref('templates').once('value')
);

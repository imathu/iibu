import { db } from './firebase';

export const doCreateUser = (id, username, email) => db.ref(`users/${id}`).set({
  username,
  email,
});
export const doRemoveUser = id => db.ref(`users/${id}`).set({});

export const doCreateAdmin = id => db.ref(`admins/${id}`).set({
  admin: true,
});
export const doRemoveAdmin = id => db.ref(`admins/${id}`).set({});

export const removeRef = () => db.off('value');

export const onceGetUsers = () => db.ref('users').once('value');
export const onceGetAdminUsers = () => db.ref('admins').once('value');

export const onceGetProjects = () => (
  db.ref('projects').once('value')
);


// Role Data
export const onceGetRoles = () => (
  db.ref('roles').once('value')
);

export const onceGetContexts = () => (
  db.ref('contexts').once('value')
);

// feedbacker data
export const onceGetFeedbackers = projectId => (
  db.ref(`projects/${projectId}/feedbackers`).once('value')
);
export const doCreateFeedbackers = (projectId, feedbackers) => (
  db.ref(`projects/${projectId}/`).update({ feedbackers })
);
export const doUpdateAnswer = (projectId, feedbackerId, clientId, questionId, score) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}/clients/${clientId}/answers/${questionId}`).update({
    score,
  })
);
export const numAnswers = (projectId, feedbackerId, clientId) => (
  db.ref(`projects/${projectId}/feedbackers/${feedbackerId}/clients/${clientId}/answers`)
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

// Project doCreateAdmin
export const onceGetProject = projectId => (
  db.ref(`projects/${projectId}`).once('value')
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

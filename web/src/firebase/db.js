import { db } from './firebase';

export const onceGetProjects = () => (
  db.ref('projects').once('value')
);

export const onceGetRoles = () => (
  db.ref('roles').once('value')
);

export const onceGetContexts = () => (
  db.ref('contexts').once('value')
);

export const onceGetFeedbackers = projectId => (
  db.ref(`projects/${projectId}/feedbackers`).once('value')
);

export const onceGetClients = projectId => (
  db.ref(`projects/${projectId}/clients`).once('value')
);

export const onceGetQuestions = projectId => (
  db.ref(`projects/${projectId}/questions`).once('value')
);

export default onceGetProjects;

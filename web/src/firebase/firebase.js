import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyCSnWI0_YWyUU56DJABUTYqz_9mlrzXNXE',
  authDomain: 'fir-auth-96d6b.firebaseapp.com',
  databaseURL: 'https://fir-auth-96d6b.firebaseio.com',
  projectId: 'fir-auth-96d6b',
  storageBucket: 'fir-auth-96d6b.appspot.com',
  messagingSenderId: '384568588057',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = firebase.database();

export default db;

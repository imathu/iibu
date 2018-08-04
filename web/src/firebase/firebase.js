import * as firebase from 'firebase';

const config = (process.env.REACT_APP_PLATFORM === 'production')
  ? {
    apiKey: 'AIzaSyCs4Fq2Di7dI3-XQdMG0Zi5YnOM9PoEeDE',
    authDomain: 'iibu-prod1.firebaseapp.com',
    databaseURL: 'https://iibu-prod1.firebaseio.com',
    projectId: 'iibu-prod1',
    storageBucket: 'iibu-prod1.appspot.com',
    messagingSenderId: '309455354121',
  }
  : {
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

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};

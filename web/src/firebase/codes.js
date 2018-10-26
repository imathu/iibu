const message = {
  'auth/invalid-email': {
    de: 'Mailadresse fehlerhaft formatiert',
    en: 'The email address is badly formatted',
  },
  'auth/user-not-found': {
    de: 'Mail oder Passwort ungültig',
    en: 'user or password invalid',
  },
  'auth/wrong-password': {
    de: 'Mail oder Passwort ungültig',
    en: 'email or password invalid',
  },
  'auth/user-disabled': {
    de: 'Benutzer ist gesperrt',
    en: 'user disabled',
  },
  'auth/email-already-in-use': {
    de: 'Die Mail Adresse existiert bereits',
    en: 'The email address is already in use',
  },
  'auth/weak-password': {
    de: 'Das Passwort ist zu einfach',
    en: 'Password should be at least 6 characters',
  },
};

export const errCode = (err, lang = 'de') => {
  if (err && err.code) {
    const m = message[err.code];
    return (m && m[lang]) || 'Ein Fehler ist aufgetreten';
  }
  return 'Ein Fehler ist aufgetreten';
};

export default errCode;

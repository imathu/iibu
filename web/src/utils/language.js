export const LANGUAGE = {
  DE: 'de',
  EN: 'en',
  FR: 'fr',
};

export const getLanguage = () => (
  localStorage.getItem('language') || LANGUAGE.DE
);

export const setLanguage = lang => (
  localStorage.setItem('language', lang)
);

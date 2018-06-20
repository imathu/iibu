export const color08 = [
  'rgba(27,133,184,0.8)',
  'rgba(90,82,85,0.8)',
  'rgba(85,158,131,0.8)',
  'rgba(174,90,65,0.8)',
  'rgba(195,203,113,0.8)',
];

export const color10 = [
  'rgba(27,133,184,1)',
  'rgba(90,82,85,1)',
  'rgba(85,158,131,1)',
  'rgba(174,90,65,1)',
  'rgba(195,203,113,1)',
];

// Arithmetic mean
const getMean = data => (
  data.reduce((a, b) => (
    Number(a) + Number(b)
  ), 0) / data.length
);

// Standard deviation
export const getSD = (data) => {
  const m = getMean(data);
  return Math.sqrt(data.reduce((sq, n) => (
    sq + ((n - m) ** 2)
  ), 0) / (data.length - 1));
};

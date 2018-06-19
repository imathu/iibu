const createBarPerContext = (labels, data, min, max) => ({
  labels,
  datasets: [{
    label: 'max',
    data: max,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    lineTension: '0.3',
    showLine: false, // no line shown
    pointRadius: 5,
    pointHoverRadius: 8,
  }, {
    label: 'min',
    data: min,
    type: 'line',
    borderColor: chartColor[1],
    borderWidth: 1,
    showLine: false, // no line shown
    pointRadius: 5,
    pointHoverRadius: 8,
  }, {
    label: 'Votes',
    data,
    borderWidth: 1,
    backgroundColor: chartColor,
    type: 'bar',
  }],
});

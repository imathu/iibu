const Parser = require('./parser');
const ParserMock = require('./parser.mock');


it('question csv test', () => {
  // muss noch gefixt werden
  expect(Parser.questionCSV2json(ParserMock.questionCSVMockNew)).toEqual(ParserMock.questionResult);
});

it('client csv test', () => {
  const returnValue = Parser.feedbackerCSV2JJSON(ParserMock.clientCSVMockNew);

  const clients = returnValue.clients;
  const feedbackers = returnValue.feedbackers;

  const clientsArray = [];
  const feedbackersArray = [];
  const clientKeys = [];

  Object.keys(clients).forEach((key) => {
    clientKeys.push(key);
    clientsArray.push(clients[key]);
  });

  Object.keys(feedbackers).forEach((key) => {
    const newFeedbacker = { ...feedbackers[key] };
    const clientsOfFeedbacker = [];
    Object.keys(feedbackers[key].clients).forEach((clientKey) => {
      clientsOfFeedbacker.push(feedbackers[key].clients[clientKey]);
    });
    newFeedbacker.clients = clientsOfFeedbacker;
    feedbackersArray.push(newFeedbacker);
  });

  // Check clients
  expect(clientsArray.length).toEqual(2);

  clientsArray.forEach((client, index) => {
    expect(client.firstname).toEqual(ParserMock.clientsResult[index].firstname);
    expect(client.name).toEqual(ParserMock.clientsResult[index].name);
    expect(client.gender).toEqual(ParserMock.clientsResult[index].gender);
    expect(client.email).toEqual(ParserMock.clientsResult[index].email);
  });


  // Check feedbackers
  expect(feedbackersArray.length).toEqual(14);

  // check if matching of client is correct
  expect(feedbackersArray.filter(feedbacker =>
    feedbacker.clients.filter(client => client.id === clientKeys[0]).length > 0).length).toEqual(9);
  expect(feedbackersArray.filter(feedbacker =>
    feedbacker.clients.filter(client => client.id === clientKeys[1]).length > 0).length).toEqual(7);

  feedbackersArray.forEach((feedbacker, index) => {
    expect(feedbacker.email).toEqual(ParserMock.feedbackerResult[index].email);
    expect(feedbacker.gender).toEqual(ParserMock.feedbackerResult[index].gender);

    expect(feedbacker.clients.length).toEqual(ParserMock.feedbackerResult[index].clients.length);

    feedbacker.clients.forEach((fbClient, clientIndex) => {
      expect(fbClient.role).toEqual(ParserMock.feedbackerResult[index].clients[clientIndex].role);
    });
  });
});

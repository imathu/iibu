const Parser = require('./parser');
const ParserMock = require('./parser.mock');


it('dummy', () => {
  expect(Parser.questionCSV2json(ParserMock.questionCSVMockNew)).toEqual(ParserMock.questionResult);
});

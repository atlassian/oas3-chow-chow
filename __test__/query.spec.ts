import ChowChow from '../src';
import ChowError from '../src/error';
const fixture = require('./fixtures/query.json');

describe('Query', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  })

  test('It should coerce query parameter to an array', () => {
    expect(() => {
      chowchow.validateRequest('/pets', {
        method: 'get',
        query: {
          petId: 123
        }
      });
    }).not.toThrow();
  });
})

import ChowChow from '../src';
import ChowError from '../src/error';
const fixture = require('./fixtures/path.json');

describe('Path', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  })

  test('It should validate the path parameters', () => {
    expect(() => {
      chowchow.validateRequest('/pets/123', {
        method: 'get'
      });
    }).not.toThrow();
  });

  test('It should throw error if path parameter fails schema check', () => {
    expect(() => {
      chowchow.validateRequest('/pets/abc', {
        method: 'get'
      });
    }).toThrowError(ChowError); 
  })
})

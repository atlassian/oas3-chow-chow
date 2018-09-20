import ChowChow from '../src';
import ChowError from '../src/error';
const fixture = require('./fixtures/query.json');

describe('Query', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  })

  it('should coerce query parameter to an array', () => {
    const queryMeta = {
      method: 'get',
      query: {
        petId: 123
      }
    };
    expect(chowchow.validateRequest('/pets', queryMeta)).toEqual(expect.objectContaining({
      query: {
        petId: [123]
      }
    }));
    expect(queryMeta.query.petId).toEqual(123);
  });

  it('should validate query parameter with escaped url format', () => {
    const queryMeta = {
      method: 'get',
      query: {
        petId: 123,
        redirectUrl: "http%3A%2F%2Fwww.atlassian.com%3A8901%2Fsuccess.html"
      }
    };
    expect(() => chowchow.validateRequest('/pets', queryMeta)).not.toThrowError();
  })

  it('should validate query parameter with url format', () => {
    const queryMeta = {
      method: 'get',
      query: {
        petId: 123,
        redirectUrl: "http://www.atlassian.com:8901/success.html"
      }
    };
    expect(() => chowchow.validateRequest('/pets', queryMeta)).not.toThrowError();
  })
})

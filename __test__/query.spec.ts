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
})

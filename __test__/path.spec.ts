import ChowChow from '../src';
import ChowError from '../src/error';
const fixture = require('./fixtures/path.json');

describe('Path', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  })

  it('should validate the path parameters and coerce to the correct type', () => {
    const pathMeta = {
      method: 'get'
    };
    expect(chowchow.validateRequest('/pets/123', pathMeta)).toEqual(expect.objectContaining({
      path: {
        petId: 123
      }
    }));
  });

  it('should throw error if path parameter fails schema check', () => {
    expect(() => {
      chowchow.validateRequest('/pets/abc', {
        method: 'get'
      });
    }).toThrowError(ChowError); 
  })
})

import ChowChow from '../src';
import ChowError from '../src/error';
const fixture = require('./fixtures/pet-store.json');

describe('Pet Store', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture as any);
  })

  test('It should throw an error if a path is undefined', () => {
    expect(() => {
      chowchow.validateRequest('/undefined', {
        method: 'get'
      });
    }).toThrowError(ChowError);
  });

  test('It should successfully throw an error if a method is undefined', () => {
    expect(() => {
      chowchow.validateRequest('/pets', {
        method: 'put'
      })
    }).toThrowError(ChowError);
  })

  describe('Path', () => {
    test('It should fail validation if provided path parameter is wrong', () => {
      expect(() => {
        chowchow.validateRequest('/pets/chow', {
          method: 'get',
          path: {
            petId: 'chow'
          }
        });
      }).toThrowError(ChowError);
    })

    test('It should pass validation if provided path parameter is correct', () => {
      expect(() => {
        chowchow.validateRequest('/pets/123', {
          method: 'get',
          path: {
            petId: 123
          }
        });
      }).not.toThrowError();
    })
  })

  describe('Query', () => {
    test('It should fail validation if provided query parameter is wrong', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            limit: 'xyz'
          }
        });
      }).toThrowError(ChowError);
    })

    test('It should pass validation if provided path parameter is correct', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            limit: 50
          }
        });
      }).not.toThrowError(); 
    })

    test('It should fail validation if a non-array is passed to parameter which should be an array', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: 'chowchow'
          }
        })
      }).toThrowError(ChowError);
    })

    test('It should pass validation if an array is passed to parameter which should be an array', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: ['chowchow']
          }
        })
      }).not.toThrowError();
    })

    test('It should fail validation if invalid item is passed in enum', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: ['nice dog']
          }
        })
      }).toThrowError(ChowError);
    })

    test('It should fail validation if number of items exceeds the limit', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: ['chowchow', 'bichon', 'jack russell', 'labrador']
          }
        })
      }).toThrowError(ChowError);
    })

    test('It should pass validation for valid array parameter', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: ['chowchow', 'bichon', 'labrador']
          }
        })
      }).not.toThrowError();
    })
  })
  describe('RequestBody', () => {
    test('It should fail validation if payload is invalid', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'post',
          body: {
            name: 'plum'
          },
          header: {
            'content-type': 'application/json'
          }
        })
      }).toThrowError(ChowError)
    })

    test('It should fail validation if invalid mediaType is asked', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'post',
          body: {
            id: 123,
            name: 'plum'
          },
          header: {
            'content-type': 'application/awsome'
          }
        })
      }).toThrowError(ChowError)
    })

    test('It should fail validation if requestBody is required but missing', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'post',
          header: {
            'content-type': 'application/json'
          }
        })
      }).toThrowError(ChowError)
    })

    test('It should pass validation if valid requestBody is passed', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'post',
          body: {
            id: 123,
            name: 'plum'
          },
          header: {
            'content-type': 'application/json'
          }
        })
      }).not.toThrowError() 
    })
  })
});

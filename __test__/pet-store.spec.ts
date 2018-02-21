import ChowChow from '../src';
import ChowChowError from '../src/error';
import * as fixture from './fixtures/pet-store.json';

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
    }).toThrowError('No matches found for given path - /undefined');
  });

  test('It should successfully throw an error if a method is undefined', () => {
    expect(() => {
      chowchow.validateRequest('/pets', {
        method: 'put'
      })
    }).toThrowError('Invalid request method - put');
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
      }).toThrowError('Parameter [petId] in path : type should be integer');
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
      }).toThrowError('Parameter [limit] in query : type should be integer');
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
      }).toThrowError('Parameter [breed] in query : type should be array');
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
      }).toThrowError('Parameter [breed] in query /0 should be equal to one of the allowed values: bichon, chowchow, jack russel');
    })

    test('It should fail validation if number of items exceeds the limit', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'get',
          query: {
            breed: ['chowchow', 'bichon', 'jack russell', 'labrador']
          }
        })
      }).toThrowError('Parameter [breed] in query : maxItems should NOT have more than 3 items');
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
            accept: 'application/json'
          }
        })
      }).toThrowError('In requestBody Required property id is missing')
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
            accept: 'application/awsome'
          }
        })
      }).toThrowError('Unsupported mediaType: application/awsome')
    })

    test('It should fail validation if requestBody is required but missing', () => {
      expect(() => {
        chowchow.validateRequest('/pets', {
          method: 'post',
          header: {
            accept: 'application/json'
          }
        })
      }).toThrowError('Missing required Request Body')
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
            accept: 'application/json'
          }
        })
      }).not.toThrowError() 
    })
  })
});

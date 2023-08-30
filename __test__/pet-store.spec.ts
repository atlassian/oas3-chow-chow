import ChowChow, { ChowOptions } from '../src';
import ChowError, { RequestValidationError } from '../src/error';
const fixture = require('./fixtures/pet-store.json');

describe('Pet Store', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture as any);
  });

  test('It should throw an error if a path is undefined', () => {
    expect(() => {
      chowchow.validateRequestByPath('/undefined', 'get', {});
    }).toThrowError(ChowError);
  });

  test('It should successfully throw an error if a method is undefined', () => {
    expect(() => {
      chowchow.validateRequestByPath('/pets', 'put', {});
    }).toThrowError(ChowError);
  });

  describe('Path', () => {
    test('It should fail validation if provided path parameter is wrong', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/chow', 'get', {
          path: {
            petId: 'chow',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should pass validation if provided path parameter is correct', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/123', 'get', {
          path: {
            petId: 123,
          },
        });
      }).not.toThrowError();
    });
  });

  describe('Query', () => {
    test('It should fail validation if provided query parameter is wrong', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            limit: 'xyz',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should pass validation if provided path parameter is correct', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            limit: 50,
          },
        });
      }).not.toThrowError();
    });

    test('It should pass validation if an array is passed to parameter which should be an array', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            breed: ['chowchow'],
          },
        });
      }).not.toThrowError();
    });

    test('It should fail validation if invalid item is passed in enum', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            breed: ['nice dog'],
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if number of items exceeds the limit', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            breed: ['chowchow', 'bichon', 'jack russell', 'labrador'],
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should pass validation for valid array parameter', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'get', {
          query: {
            breed: ['chowchow', 'bichon', 'labrador'],
          },
        });
      }).not.toThrowError();
    });
  });
  describe('Configure ChowOptions for allErrors', () => {
    test('It should fail validation and receive multiple errors if payload is invalid and ChowOptions configured with allErrors:true', () => {
      let chowOptions: Partial<ChowOptions> = {
        requestBodyAjvOptions: { allErrors: true },
      };
      chowchow = new ChowChow(fixture as any, chowOptions);

      try {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            name: 123,
          },
          header: {
            'content-type': 'application/json',
          },
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ChowError);
        const chowError: ChowError = e as any;
        expect(chowError.toJSON().suggestions.length).toBe(2);
        expect(
          chowError.meta.rawErrors && chowError.meta.rawErrors.length
        ).toBe(2);
      }
    });

    test('It should fail validation and receive a single error if payload is invalid and ChowOptions configured for allErrors:false', () => {
      let chowOptions: Partial<ChowOptions> = {
        requestBodyAjvOptions: { allErrors: false },
      };
      chowchow = new ChowChow(fixture as any, chowOptions);

      try {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            name: 123,
          },
          header: {
            'content-type': 'application/json',
          },
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ChowError);
        const chowError: ChowError = e as any;
        expect(chowError.toJSON().suggestions.length).toBe(1);
        expect(
          chowError.meta.rawErrors && chowError.meta.rawErrors.length
        ).toBe(1);
      }
    });

    test('It should fail validation and receive a single error if payload is invalid and ChowOptions not configured', () => {
      chowchow = new ChowChow(fixture as any);

      try {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            name: 123,
          },
          header: {
            'content-type': 'application/json',
          },
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(ChowError);
        const chowError: ChowError = e as any;
        expect(chowError.toJSON().suggestions.length).toBe(1);
        expect(
          chowError.meta.rawErrors && chowError.meta.rawErrors.length
        ).toBe(1);
      }
    });
  });

  describe('RequestBody', () => {
    test('It should fail validation if payload is invalid', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            name: 'plum',
          },
          header: {
            'content-type': 'application/json',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if invalid mediaType is asked', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            id: 123,
            name: 'plum',
          },
          header: {
            'content-type': 'application/awsome',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if requestBody is required but missing', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {
          header: {
            'content-type': 'application/json',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if requestBody is required but Content type is missing', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {});
      }).toThrowError(ChowError);
    });

    test('It is ok to ignore body if it is not required', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/123', 'post', {
          path: {
            petId: 123,
          },
          header: {
            'content-type': 'application/json',
          },
        });
      }).not.toThrowError();
    });

    test('It should pass validation if valid requestBody is passed', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            id: 123,
            name: 'plum',
            writeOnlyProp: '42',
            notReadOnlyProp: '42',
          },
          header: {
            'content-type': 'application/json',
          },
        });
      }).not.toThrowError();
    });

    test('It should fail validation if requestBody with readOnly property passed', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets', 'post', {
          body: {
            id: 123,
            name: 'plum',
            readOnlyProp: '42',
          },
          header: {
            'content-type': 'application/json',
          },
        });
      }).toThrow(RequestValidationError);
    });

    test('It returns defined body content type', () => {
      expect(
        chowchow.getDefinedRequestBodyContentType('/pets', 'post')
      ).toMatchSnapshot();
    });

    test('It returns empty array for defined body content type if path is undefined', () => {
      expect(
        chowchow.getDefinedRequestBodyContentType('/nonono', 'post')
      ).toMatchSnapshot();
    });

    test('It returns empty array for defined body content type if method is undefined', () => {
      expect(
        chowchow.getDefinedRequestBodyContentType('/pets', 'head')
      ).toMatchSnapshot();
    });

    test('It returns empty array for defined body content type if requestBody is not defined', () => {
      expect(
        chowchow.getDefinedRequestBodyContentType('/pets', 'get')
      ).toMatchSnapshot();
    });
  });

  describe('Header', () => {
    test('It should fail validation if a required header is missing', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/header', 'get', {
          header: {
            'content-type': 'application/json',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if a header fails schema validation', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/header', 'get', {
          header: {
            version: 'awsome version',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should pass validation if headers are satisfied', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/header', 'get', {
          header: {
            version: 123,
          },
        });
      }).not.toThrowError();
    });

    test('It should pass for header without schema', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/header', 'get', {
          header: {
            version: 123,
            'no-schema': 123,
          },
        });
      }).not.toThrowError();
    });
  });

  describe('Cookie', () => {
    test('It should fail validation if a required cookie is missing', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/cookie', 'get', {
          cookie: {},
        });
      }).toThrowError(ChowError);
    });

    test('It should fail validation if a cookie fails schema validation', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/cookie', 'get', {
          cookie: {
            count: 'many',
          },
        });
      }).toThrowError(ChowError);
    });

    test('It should pass validation if cookies are satisfied', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/cookie', 'get', {
          cookie: {
            count: 123,
          },
        });
      }).not.toThrowError();
    });
  });

  describe('Schema', () => {
    test('It is ok to not give a schema', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/schema', 'get', {
          cookie: {
            count: 123,
          },
        });
      }).not.toThrowError();
    });

    test('It is ok to use wildcards', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/wildcard', 'post', {
          body: {
            id: 123,
            name: 'plum',
          },
          header: {
            'content-type': 'application/awesome',
          },
        });
      }).not.toThrowError();
    });

    test('It is ok to fall back to */* when no content type is provided', () => {
      expect(() => {
        chowchow.validateRequestByPath('/test/wildcard', 'post', {
          body: [
            {
              id: 123,
              name: 'plum',
            },
            {
              id: 456,
              name: 'chow',
            },
          ],
        });
      }).not.toThrowError();
    });
  });

  describe('OperationId', () => {
    test('It should return unique operationId', () => {
      const validatedRequest = chowchow.validateRequestByPath(
        '/pets/123',
        'get',
        {
          path: {
            petId: 123,
          },
        }
      );
      expect(validatedRequest.operationId).toEqual('showPetById');
    });

    test('It should respect custom operationId', () => {
      const validatedRequest = chowchow.validateRequestByPath(
        '/pets/123',
        'get',
        {
          operationId: 'customId',
          path: {
            petId: 123,
          },
        }
      );
      expect(validatedRequest.operationId).toEqual('customId');
    });
  });
});

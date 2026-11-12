import ChowChow from '../src';
import ChowError, { ResponseValidationError } from '../src/error';
import { ResponseMeta } from '../src/compiler';

const fixture = require('./fixtures/response.json');

describe('Response', () => {
  let chowchow: ChowChow;

  beforeAll(async () => {
    chowchow = await ChowChow.create(fixture);
  });

  it('should validate the response with status code', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
      },
      body: [
        {
          id: 1,
          name: 'plum',
          readOnlyProp: '42',
          notWriteOnlyProp: '42',
        },
      ],
    };
    expect(
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta)
    ).toEqual(responseMeta);
    expect(
      chowchow.validateResponseByOperationId('showPetById', responseMeta)
    ).toEqual(responseMeta);
  });

  it('should pass if a field that is nullable: true is null', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
      },
      body: [
        {
          id: 1,
          name: 'plum',
          tag: null,
        },
      ],
    };
    expect(
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta)
    ).toEqual(responseMeta);
    expect(
      chowchow.validateResponseByOperationId('showPetById', responseMeta)
    ).toEqual(responseMeta);
  });

  it('should fail validation the response with writeOnly property', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
      },
      body: [
        {
          id: 1,
          name: 'plum',
          writeOnlyProp: '42',
        },
      ],
    };
    expect(() =>
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta)
    ).toThrow(ResponseValidationError);
    expect(() =>
      chowchow.validateResponseByOperationId('showPetById', responseMeta)
    ).toThrow(ResponseValidationError);
  });

  it('should fall back to default if no status code is matched', () => {
    const responseMeta: ResponseMeta = {
      status: 500,
      header: {
        'content-type': 'application/json',
      },
      body: {
        code: 500,
        message: 'something is wrong',
      },
    };
    expect(
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta)
    ).toEqual(responseMeta);
    expect(
      chowchow.validateResponseByOperationId('showPetById', responseMeta)
    ).toEqual(responseMeta);
  });

  it('should throw error if path parameter fails schema check', () => {
    expect(() => {
      chowchow.validateRequestByPath('/pets/abc', 'get', {});
    }).toThrowError(ChowError);
  });

  it('should fail on unsupported response media type', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/nonono',
      },
    };
    expect(() => {
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta);
    }).toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('showPetById', responseMeta);
    }).toThrow();
  });

  it('should ignore on empty response media type', () => {
    const responseMeta: ResponseMeta = {
      status: 204,
      header: {
        'content-type': '',
      },
    };
    expect(() => {
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta);
    }).not.toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('showPetById', responseMeta);
    }).not.toThrow();
  });

  it('should ignore on empty response header', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
    };
    expect(() => {
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta);
    }).not.toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('showPetById', responseMeta);
    }).not.toThrow();
  });

  it('should extract media type correctly in Content-Type header', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json; charset=utf-8',
      },
    };
    expect(() => {
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta);
    }).toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('showPetById', responseMeta);
    }).toThrow();
  });

  it('should fail if response body is invalid', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
      },
      body: [
        {
          id: 1,
        },
      ],
    };
    expect(() => {
      chowchow.validateResponseByPath('/pets/123', 'get', responseMeta);
    }).toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('showPetById', responseMeta);
    }).toThrow();
  });

  it('should fail if response code does not match any', () => {
    const responseMeta: ResponseMeta = {
      status: 400,
      header: {
        'content-type': 'application/json',
      },
    };
    expect(() => {
      chowchow.validateResponseByPath('/no-default', 'get', responseMeta);
    }).toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('/no-default', responseMeta);
    }).toThrow();
  });

  it('should fail if response method is invalid', () => {
    expect(() => {
      chowchow.validateResponseByPath('/no-default', 'path', {
        status: 400,
        header: {
          'content-type': 'application/json',
        },
      });
    }).toThrow();
  });

  it('validateResponseByPath should fail if header value is invalid', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
        version: [1, 2],
      },
    };

    expect(() =>
      chowchow.validateResponseByPath('/header', 'get', responseMeta)
    ).toThrowErrorMatchingSnapshot();
  });

  it('validateResponseByOperationId should fail if header value is invalid', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        'content-type': 'application/json',
        version: [1, 2],
      },
    };

    expect(() =>
      chowchow.validateResponseByOperationId('getHeader', responseMeta)
    ).toThrowErrorMatchingSnapshot();
  });

  it('should succeed if header case is different than spec', () => {
    const lowercaseHeaderName = 'version';
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        [lowercaseHeaderName]: '1',
      },
    };

    // test validateResponseByPath
    expect(() =>
      chowchow.validateResponseByPath('/header', 'get', responseMeta)
    ).not.toThrow();
  });

  it('should succeed if header case is same as spec', () => {
    const uppercaseHeaderName = 'Version';
    const responseMeta: ResponseMeta = {
      status: 200,
      header: {
        [uppercaseHeaderName]: '1',
      },
    };

    // test validateResponseByPath
    expect(() =>
      chowchow.validateResponseByPath('/header', 'get', responseMeta)
    ).not.toThrow();
  });

  it('should fail if required header is empty', () => {
    const responseMeta: ResponseMeta = {
      status: 200,
    };
    expect(() => {
      chowchow.validateResponseByPath('/header', 'get', responseMeta);
    }).toThrow();
    expect(() => {
      chowchow.validateResponseByOperationId('getHeader', responseMeta);
    }).toThrow();
  });
});

describe('Response wildcard status codes', () => {
  const wildcardSpec = {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Wildcard Response Spec',
    },
    paths: {
      '/items': {
        get: {
          operationId: 'listItems',
          responses: {
            '200': {
              description: 'Exact 200',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['exact'],
                    properties: { exact: { type: 'boolean' } },
                  },
                },
              },
            },
            '2XX': {
              description: '2XX wildcard',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['okRange'],
                    properties: { okRange: { type: 'string' } },
                  },
                },
              },
            },
            '4XX': {
              description: '4XX wildcard',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['clientError'],
                    properties: { clientError: { type: 'string' } },
                  },
                },
              },
            },
            default: {
              description: 'Fallback',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['fallback'],
                    properties: { fallback: { type: 'boolean' } },
                  },
                },
              },
            },
          },
        },
      },
      '/only-2xx': {
        get: {
          operationId: 'only2xx',
          responses: {
            '1XX': { description: '1XX wildcard' },
            '2XX': { description: '2XX wildcard' },
            '3XX': { description: '3XX wildcard' },
            '5XX': { description: '5XX wildcard' },
          },
        },
      },
    },
  };

  let chowchow: ChowChow;

  beforeAll(async () => {
    chowchow = await ChowChow.create(wildcardSpec);
  });

  it('gives explicit status code precedence over wildcard range', () => {
    expect(() =>
      chowchow.validateResponseByPath('/items', 'get', {
        status: 200,
        header: { 'content-type': 'application/json' },
        body: { exact: true },
      })
    ).not.toThrow();

    expect(() =>
      chowchow.validateResponseByPath('/items', 'get', {
        status: 200,
        header: { 'content-type': 'application/json' },
        body: { okRange: 'created' },
      })
    ).toThrow(ResponseValidationError);
  });

  it('matches uppercase X wildcard ranges and gives them precedence over default', () => {
    expect(() =>
      chowchow.validateResponseByPath('/items', 'get', {
        status: 201,
        header: { 'content-type': 'application/json' },
        body: { okRange: 'created' },
      })
    ).not.toThrow();

    expect(() =>
      chowchow.validateResponseByOperationId('listItems', {
        status: 422,
        header: { 'content-type': 'application/json' },
        body: { clientError: 'unprocessable' },
      })
    ).not.toThrow();

    expect(() =>
      chowchow.validateResponseByPath('/items', 'get', {
        status: 204,
        header: { 'content-type': 'application/json' },
        body: { fallback: true },
      })
    ).toThrow(ResponseValidationError);
  });

  it('falls back to default when no explicit or wildcard code matches', () => {
    expect(() =>
      chowchow.validateResponseByPath('/items', 'get', {
        status: 503,
        header: { 'content-type': 'application/json' },
        body: { fallback: true },
      })
    ).not.toThrow();
  });

  it('supports 1XX, 2XX, 3XX, and 5XX ranges and rejects unmatched codes without default', () => {
    for (const status of [101, 202, 304, 502]) {
      expect(() =>
        chowchow.validateResponseByPath('/only-2xx', 'get', { status })
      ).not.toThrow();
    }

    expect(() =>
      chowchow.validateResponseByPath('/only-2xx', 'get', { status: 404 })
    ).toThrow(ChowError);

    expect(() =>
      chowchow.validateResponseByPath('/only-2xx', 'get', { status: 600 })
    ).toThrow(ChowError);
  });
});

import ChowChow from '../src';
import ChowError, { ResponseValidationError } from '../src/error';
import { ResponseMeta } from '../src/compiler';

const fixture = require('./fixtures/response.json');

describe('Response', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
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
      body: [
        {
          code: 500,
          message: 'something is wrong',
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
      chowchow.validateResponse('/no-default', {
        method: 'path',
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

import ChowChow from '../src';
import ChowError, { ResponseValidationError } from '../src/error';
import {ResponseMeta} from '../src/compiler';

const fixture = require('./fixtures/response.json');

describe('Response', () => {
  let chowchow: ChowChow;

  beforeAll(() => {
    chowchow = new ChowChow(fixture);
  });

  it('should validate the response with status code', () => {
    const responseMeta: ResponseMeta = {
      method: 'get',
      status: 200,
      header: {
        'content-type': 'application/json'
      },
      body: [
        {
          id: 1,
          name: 'plum',
          readOnlyProp: '42',
          notWriteOnlyProp: '42'
        }
      ]
    };
    expect(chowchow.validateResponse('/pets/123', responseMeta)).toEqual(responseMeta);
  });

  it('should fail validation the response with writeOnly property', () => {
    const responseMeta: ResponseMeta = {
      method: 'get',
      status: 200,
      header: {
        'content-type': 'application/json'
      },
      body: [
        {
          id: 1,
          name: 'plum',
          writeOnlyProp: '42'
        }
      ]
    };
    expect(() => chowchow.validateResponse('/pets/123', responseMeta)).toThrow(ResponseValidationError);
  });

  it('should fall back to default if no status code is matched', () => {
    const responseMeta: ResponseMeta = {
      method: 'get',
      status: 500,
      header: {
        'content-type': 'application/json'
      },
      body: [
        {
          code: 500,
          message: 'something is wrong'
        }
      ]
    };
    expect(chowchow.validateResponse('/pets/123', responseMeta)).toEqual(responseMeta);
  });

  it('should throw error if path parameter fails schema check', () => {
    expect(() => {
      chowchow.validateRequest('/pets/abc', {
        method: 'get'
      });
    }).toThrowError(ChowError);
  });

  it('should fail on unsupported response media type', () => {
    expect(() => {
      chowchow.validateResponse('/pets/123', {
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/nonono'
        }
      });
    }).toThrow();
  })

  it('should ignore on empty response media type', () => {
    expect(() => {
      chowchow.validateResponse('/pets/123', {
        method: 'get',
        status: 204,
        header: {
          'content-type': ''
        }
      });
    }).not.toThrow();
  })

  it('should extract media type correctly in Content-Type header', () => {
    expect(() => {
      chowchow.validateResponse('/pets/123', {
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/json; charset=utf-8'
        }
      });
    }).toThrow();
  })

  it('should fail if response body is invalid', () => {
    expect(() => {
      chowchow.validateResponse('/pets/123', {
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/json'
        },
        body: [
          {
            id: 1
          }
        ]
      });
    }).toThrow();
  })

  it('should fail if response code does not match any', () => {
    expect(() => {
      chowchow.validateResponse('/no-default', {
        method: 'get',
        status: 400,
        header: {
          'content-type': 'application/json'
        }
      });
    }).toThrow();
  })

  it('should fail if response method is invalid', () => {
    expect(() => {
      chowchow.validateResponse('/no-default', {
        method: 'path',
        status: 400,
        header: {
          'content-type': 'application/json'
        }
      });
    }).toThrow();
  })

  it('should fail if header is invalid', () => {
    expect(() => {
      chowchow.validateResponse('/header', {
        method: 'get',
        status: 200,
        header: {
          'content-type': 'application/json',
          'version': [1, 2]
        }
      });
    }).toThrow();
  })

  it('should fail if required header is empty', () => {
    expect(() => {
      chowchow.validateResponse('/header', {
        method: 'get',
        status: 200
      });
    }).toThrow();
  })
});

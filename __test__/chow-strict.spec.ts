import { OpenAPIObject, PathItemObject } from 'openapi3-ts';
import ChowChow from '../src';

/**
 * https://ajv.js.org/strict-mode.html
 */
describe('strict mode', () => {
  it('show log warn and not throw by default', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const doc: OpenAPIObject = {
      openapi: '3.0.1',
      info: {
        title: 'service open api spec',
        version: '1.0.1',
      },
      components: {
        schemas: {
          ResolveUnsupportedError: {
            type: 'array',
            additionalItems: false,
          },
        },
      },
      paths: {
        '/resolve': {
          post: {
            operationId: 'resolve',
            responses: {
              '404': {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/ResolveUnsupportedError',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    expect(await ChowChow.create(doc)).toBeDefined();
    expect(warnSpy).toHaveBeenCalledWith(
      'strict mode: "additionalItems" is ignored when "items" is not an array of schemas'
    );
    warnSpy.mockRestore();
  });

  it('should not log warning about example keyword', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const doc: OpenAPIObject = {
      openapi: '3.0.1',
      info: {
        title: 'service open api spec',
        version: '1.0.1',
      },
      components: {
        schemas: {
          ResolveUnsupportedError: {
            type: 'object',
            description: 'some description',
            properties: {
              error: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'some example',
                  },
                },
              },
            },
          },
        },
      },
      paths: {
        '/resolve': {
          post: {
            operationId: 'resolve',
            responses: {
              '404': {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/ResolveUnsupportedError',
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    expect(await ChowChow.create(doc)).toBeDefined();
    expect(warnSpy).not.toHaveBeenCalledWith(
      'strict mode: unknown keyword: "example"'
    );
    warnSpy.mockRestore();
  });
});

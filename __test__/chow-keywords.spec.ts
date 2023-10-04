import { OpenAPIObject, PathItemObject } from 'openapi3-ts';
import ChowChow from '../src';
const doc: OpenAPIObject = {
  openapi: '3.0.1',
  info: {
    title: 'Object Resolver Service open api spec',
    version: '1.0.1',
  },
  components: {
    schemas: {
      ResolveUnsupportedError: {
        type: 'object',
        description:
          'This error is thrown when a request for a unsupported url is made in the resolve path (check path will just return unsupported)',
        example:
          '{error: {type: "ResolveUnsupportedError", message: "Invalid URL when trying to parse url", status: 404}}',
        required: ['error'],
        additionalProperties: false,
        properties: {
          error: {
            type: 'object',
            required: ['message', 'type', 'status'],
            additionalProperties: false,
            properties: {
              type: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
              status: {
                type: 'integer',
                default: 404,
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
        description: 'Resolve an URL into a Object model.',
        tags: ['Resolving URLs into JSON-LD'],
        responses: {
          '404': {
            description: 'This URL is not supported by any objectProvider',
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
describe('keywords', () => {
  // OpenAPI schemas can also use keywords that are not part of JSON Schema
  // see "Additional Keywords" section in https://swagger.io/docs/specification/data-models/keywords/
  it('"example" keyword should be allowed', () => {
    expect(ChowChow.create(doc)).toBeDefined();
  });
});

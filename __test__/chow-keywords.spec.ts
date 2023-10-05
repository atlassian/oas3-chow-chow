import { OpenAPIObject } from 'openapi3-ts';
import ChowChow from '../src';
const doc: (additionalKeywords: Record<string, any>) => OpenAPIObject = (
  additionalKeywords = {}
) => ({
  openapi: '3.0.1',
  info: {
    title: 'Object Resolver Service open api spec',
    version: '1.0.1',
  },
  components: {
    schemas: {
      ResolveUnsupportedError: {
        type: 'object',
        properties: {
          error: {},
        },
        ...additionalKeywords,
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
});

describe('additional open api keywords', () => {
  it.each([
    { discriminator: '' },
    { example: '' },
    { externalDocs: '' },
    { xml: '' },
  ])('"%s" keyword should be allowed by default', async (additionalKeyword) => {
    expect(await ChowChow.create(doc(additionalKeyword))).toBeDefined();
  });
});

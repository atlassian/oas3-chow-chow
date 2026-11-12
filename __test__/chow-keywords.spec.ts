import { OpenAPIObject } from 'openapi3-ts';
import ChowChow from '../src';
const doc: (additionalKeywords: Record<string, any>) => OpenAPIObject = (
  additionalKeywords = {}
) => ({
  openapi: '3.0.1',
  info: {
    title: 'service open api spec',
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

  it('allows readOnly and writeOnly when schemaContext is unavailable (parameters and headers)', async () => {
    const spec: OpenAPIObject = {
      openapi: '3.0.1',
      info: {
        title: 'readOnly / writeOnly context test',
        version: '1.0.0',
      },
      paths: {
        '/items/{id}': {
          get: {
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string', readOnly: true },
              },
              {
                name: 'filter',
                in: 'query',
                schema: { type: 'string', writeOnly: true },
              },
            ],
            responses: {
              '200': {
                description: 'ok',
                headers: {
                  'x-etag': {
                    schema: { type: 'string', readOnly: true },
                  },
                },
              },
            },
          },
        },
      },
    };

    const chowchow = await ChowChow.create(spec);
    expect(() =>
      chowchow.validateRequestByPath('/items/123', 'get', {
        path: { id: '123' },
        query: { filter: 'active' },
      })
    ).not.toThrow();

    expect(() =>
      chowchow.validateResponseByPath('/items/123', 'get', {
        status: 200,
        header: { 'x-etag': 'abc' },
      })
    ).not.toThrow();
  });
});

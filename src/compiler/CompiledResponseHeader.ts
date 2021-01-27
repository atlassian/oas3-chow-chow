import { HeadersObject, SchemaObject, HeaderObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';
import { ChowOptions } from '..';

export default class CompiledResponseHeader {
  private compiledSchema: CompiledSchema;
  private headerSchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: [],
  };
  /**
   * If a response header is defined with the name "Content-Type", it SHALL be ignored.
   */
  private ignoreHeaders = ['Content-Type'];

  constructor(headers: HeadersObject = {}, options: Partial<ChowOptions>) {
    for (const name in headers) {
      if (this.ignoreHeaders.includes(name)) {
        continue;
      }

      const headerNameLower = name.toLowerCase();
      const header = headers[name] as HeaderObject;

      if (header.schema) {
        this.headerSchema.properties![headerNameLower] = header.schema;
      }

      if (header.required) {
        this.headerSchema.required!.push(headerNameLower);
      }
    }
    this.compiledSchema = new CompiledSchema(
      this.headerSchema,
      options.headerAjvOptions || {}
    );
  }

  public validate(header: any = {}) {
    try {
      // Before validation, lowercase the header name, since header name is also lowercased in compiledSchema
      const newHeader = Object.entries(header).reduce(
        (newObject: any, [key, value]) => {
          newObject[key.toLowerCase()] = value;
          return newObject;
        },
        {}
      );

      this.compiledSchema.validate(newHeader);
    } catch (e) {
      throw new ChowError('Schema validation error', {
        in: 'response-header',
        rawErrors: e,
      });
    }
  }
}

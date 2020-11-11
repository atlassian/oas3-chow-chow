import { HeadersObject, SchemaObject, HeaderObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';
import { ChowOptions } from '..';

export default class CompiledResponseHeader {
  private compiledSchema: CompiledSchema;
  private headerSchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: []
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
      const header = headers[name] as HeaderObject;

      if (header.schema) {
        this.headerSchema.properties![name] = header.schema;
      }

      if (header.required) {
        this.headerSchema.required!.push(name);
      }
    }
    this.compiledSchema = new CompiledSchema(this.headerSchema, options.headerAjvOptions || {});
  }

  public validate(value: any = {}) {
    try {
      this.compiledSchema.validate(value);
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'response-header', rawErrors: e });
    }
  }
}

import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledParameterHeader {
  private compiledSchema: CompiledSchema;
  private headerSchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: [],
    // All header properties should be a string, no?
    additionalProperties: { type: 'string' }
  };
  /**
   * If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
   * the parameter definition SHALL be ignored.
   */
  private ignoreHeaders = ['Accept', 'Content-Type', 'Authorization'];

  constructor(parameters: ParameterObject[]) {
    for (const parameter of parameters) {
      if (this.ignoreHeaders.includes(parameter.name)) {
        continue;
      }

      this.headerSchema.properties![parameter.name] = parameter.schema || {};

      if (parameter.required) {
        this.headerSchema.required!.push(parameter.name);
      }
    }

    this.compiledSchema = new CompiledSchema(this.headerSchema);
  }

  /**
   * If there is no header passed in, we make it an empty object
   */
  public validate(value: any = {}) {
    try {
      this.compiledSchema.validate(value);
      return value;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'header', rawErrors: e });
    }
  }
}

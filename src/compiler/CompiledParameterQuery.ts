import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledParameterQuery {
  private compiledSchema: CompiledSchema;
  private querySchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(parameters: ParameterObject[]) {
    for (const parameter of parameters) {
      this.querySchema.properties![parameter.name] = parameter.schema || {};
      if (parameter.required) {
        this.querySchema.required!.push(parameter.name);
      }
    }

    /**
     * We want path to coerce type in general
     * For example:
     *   `?query=x` will be valid against a schema with type=array
     */
    this.compiledSchema = new CompiledSchema(this.querySchema, { coerceTypes: 'array' });
  }

  /**
   * If there is no query passed in, we make it an empty object
   */
  public validate(value: any = {}) {
    try {
      const coercedValue = {...value};
      this.compiledSchema.validate(coercedValue);
      return coercedValue;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'query', rawErrors: e });
    }
  }
}

import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledParameterQuery {
  private compiledSchema: CompiledSchema;
  private querySchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: { type: 'string' }
  };

  constructor(parameters: ParameterObject[]) {
    for (const parameter of parameters) {
      if (parameter.schema) {
        this.querySchema.properties![parameter.name] = parameter.schema;
      }
      if (parameter.required) {
        this.querySchema.required!.push(parameter.name);
      }
    }

    /**
     * We want query to coerce to array if needed
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
      this.compiledSchema.validate(value);
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'query', rawErrors: e });
    }
  }
}

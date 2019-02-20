import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';
import { ChowOptions } from '..';

export default class CompiledParameterPath {
  private compiledSchema: CompiledSchema;
  private pathSchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(parameters: ParameterObject[], options: Partial<ChowOptions>) {
    for (const parameter of parameters) {
      this.pathSchema.properties![parameter.name] = parameter.schema || {};
      /**
       * All path parameters are required
       */
      this.pathSchema.required!.push(parameter.name);
    }

    /**
     * We want query to coerce to array if needed
     * For example:
     *   `/pets/123` will be valid against a schema with type=number even if `123` is string
     */
    this.compiledSchema = new CompiledSchema(this.pathSchema, { coerceTypes: true, ...(options.pathAjvOptions ? options.pathAjvOptions : {}) });
  }

  /**
   * If there is no path passed in, we make it an empty object
   */
  public validate(value: any) {
    try {
      const coercedValue = {...value};
      this.compiledSchema.validate(coercedValue);
      return coercedValue;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'path', rawErrors: e });
    }
  }
}

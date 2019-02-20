import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';
import * as querystring from 'querystring'
import { ChowOptions } from '..';

export default class CompiledParameterQuery {
  private compiledSchema: CompiledSchema;
  private querySchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(parameters: ParameterObject[], options: Partial<ChowOptions>) {
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
    this.compiledSchema = new CompiledSchema(this.querySchema, { coerceTypes: 'array', ...(options.queryAjvOptions ? options.queryAjvOptions : {}) });
  }

  /**
   * If there is no query passed in, we make it an empty object
   */
  public validate(value: any = {}) {
    try {
      /**
       * unescape the query if neccessary
       */
      const coercedValue = Object.keys(value).reduce((result: any, key) => {
        if (typeof value[key] === 'string') {
          result[key] = querystring.unescape(value[key]);
        } else {
          result[key] = value[key];
        }
        return result;
      }, {});
      this.compiledSchema.validate(coercedValue);
      return coercedValue;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'query', rawErrors: e });
    }
  }
}

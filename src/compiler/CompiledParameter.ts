import { ParameterObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledParameter {
  private name: string;
  private in: string;
  private required: boolean;
  private ignored: boolean;
  private compiledSchema: CompiledSchema;
  /**
   * If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
   * the parameter definition SHALL be ignored.
   */
  private ignoreHeaders = ['Accept', 'Content-Type', 'Authorization'];

  constructor(parameter: ParameterObject) {
    this.name = parameter.name;
    this.in = parameter.in;
    this.required = !!parameter.required;
    this.ignored = parameter.in === 'header' && this.ignoreHeaders.includes(parameter.name)
    this.compiledSchema = new CompiledSchema(parameter.schema);
  }

  public validate(value: any) {
    if (this.ignored) {
      return
    } else if (value) {
      try {
        this.compiledSchema.validate(value);
      } catch(e) {
        throw new ChowError('Schema validation error', { in: this.in, name: this.name, rawErrors: e });
      }
    } else if (this.required) {
      throw new ChowError('Missing required parameter', { in: this.in, name: this.name });
    }
  }
}

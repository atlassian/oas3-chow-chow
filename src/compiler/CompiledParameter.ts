import { ParameterObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';

export default class CompiledParameter {
  private name: string;
  private in: string;
  private required: boolean;
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
    if (parameter.in === 'header' && this.ignoreHeaders.includes(parameter.name)) {
      this.compiledSchema = new CompiledSchema(null);
    } else {
      this.compiledSchema = new CompiledSchema(parameter.schema);
    }
  }

  public validate(value: any) {
    if (!value && this.required) {
      throw new Error(`Missing required parameter - ${this.name} in ${this.in}`)
    }
    return this.compiledSchema.validate(value);
  }
}

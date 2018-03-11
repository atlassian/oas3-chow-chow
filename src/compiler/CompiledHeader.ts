import { HeaderObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledHeader {
  private name: string;
  private in: string = 'header';
  private required: boolean;
  private ignored: boolean;
  private compiledSchema: CompiledSchema;
  /**
   * If a response header is defined with the name "Content-Type", it SHALL be ignored.
   */
  private ignoreHeaders = ['Content-Type'];

  constructor(header: HeaderObject) {
    this.name = header.name;
    this.required = !!header.required;
    this.ignored = this.ignoreHeaders.includes(header.name)
    this.compiledSchema = new CompiledSchema(header.schema);
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

import { MediaTypeObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledMediaType {
  private name: string;
  private compiledSchema: CompiledSchema;

  constructor(name: string, mediaType: MediaTypeObject) {
    this.name = name;
    this.compiledSchema = new CompiledSchema(mediaType.schema || {},
      {},
      { schemaContext: 'response' });
  }

  public validate(value: any) {
    try {
      this.compiledSchema.validate(value);
      return value;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: `media-type:${this.name}`, rawErrors: e });
    }
  }

  static extractMediaType(contentType: string | undefined): string | undefined {
    if (!contentType) {
      return;
    }

    return contentType.split(';')[0];
  }
}

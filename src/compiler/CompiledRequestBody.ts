import { RequestBodyObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledRequestBody {
  private compiledSchemas: {
    [key: string]: CompiledSchema;
  };
  private required: boolean;

  constructor(requestBody: RequestBodyObject) {
    this.compiledSchemas = Object.keys(requestBody.content).reduce((compiled: any, mediaType: string) => {
      compiled[mediaType] = new CompiledSchema(requestBody.content[mediaType].schema);
      return compiled;
    }, {});
    this.required = !!requestBody.required;
  }

  public validate(mediaType: string, value: any) {
    if (this.required && !value) {
      throw new Error('Missing required Request Body');
    }
    if (!this.required && !value) {
      return;
    }
    if (!this.compiledSchemas[mediaType]) {
      throw new Error(`Unsupported mediaType: ${mediaType}`);
    }

    try {
      this.compiledSchemas[mediaType].validate(value);
    } catch(e) {
      throw new ChowError('requestBody', undefined, e[0].error);
    }
  }
}

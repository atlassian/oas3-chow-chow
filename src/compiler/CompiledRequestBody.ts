import { RequestBodyObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';

export default class CompiledRequestBody {
  private compiledSchemas: {
    [key: string]: CompiledSchema;
  };

  constructor(requestBody: RequestBodyObject) {
    this.compiledSchemas = Object.keys(requestBody.content).reduce((compiled, mediaType: string) => {
      compiled[mediaType] = new CompiledSchema(requestBody.content[mediaType].schema);
      return compiled;
    }, {});
  }
}

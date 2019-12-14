import { RequestBodyObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';
import { ChowOptions } from '..';

export default class CompiledRequestBody {
  private compiledSchemas: {
    [key: string]: CompiledSchema;
  };
  private required: boolean;

  constructor(requestBody: RequestBodyObject, options: Partial<ChowOptions>) {
    this.compiledSchemas = Object.keys(requestBody.content).reduce(
      (compiled: any, mediaType: string) => {
        const key = mediaType.toLowerCase(); // normalise
        compiled[key] = new CompiledSchema(
          requestBody.content[mediaType].schema || {},
          options.requestBodyAjvOptions,
          { schemaContext: 'request' }
        );
        return compiled;
      },
      {}
    );
    this.required = !!requestBody.required;
  }

  public validate(mediaType: string | undefined, value: any) {
    if (this.required && !value) {
      throw new ChowError('Missing required body', { in: 'request-body' });
    }
    if (!this.required && !value) {
      return value;
    }
    const compiledSchema = this.findCompiledSchema(mediaType);
    if (!compiledSchema) {
      throw new ChowError(`Unsupported mediaType: "${mediaType}"`, { in: 'request-body' });
    }

    try {
      compiledSchema.validate(value);
      return value;
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'request-body', rawErrors: e });
    }
  }

  public getDefinedContentTypes(): string[] {
    return Object.keys(this.compiledSchemas).filter(type => this.compiledSchemas.hasOwnProperty(type));
  }

  private findCompiledSchema(mediaType: string | undefined): CompiledSchema | undefined {
    if (!mediaType) {
      mediaType = '*/*';
    }
    mediaType = mediaType.toLowerCase(); // normalise
    if (this.compiledSchemas[mediaType]) {
      return this.compiledSchemas[mediaType];
    }
    // try wildcard
    const parts = mediaType.split('/');
    // mediaTypeRange name taken from https://github.com/OAI/OpenAPI-Specification/pull/1295/files
    const mediaTypeRange = parts[0] + '/*';
    if (this.compiledSchemas[mediaTypeRange]) {
      return this.compiledSchemas[mediaTypeRange];
    }
    return this.compiledSchemas['*/*']; // last choice, may be undefined.
  }
}

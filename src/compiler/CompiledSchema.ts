import { SchemaObject } from 'openapi3-ts';
import * as Ajv from 'ajv';
import betterAjvErrors from 'better-ajv-errors';
import ajv from './ajv';

export default class CompiledSchema {
  private schemaObject?: SchemaObject;
  private validator: Ajv.ValidateFunction;

  constructor(schema: SchemaObject, opts?: Ajv.Options, context?: any) {
    /**
     * Removing unsupported additional OpenAPI keywords.
     * https://swagger.io/docs/specification/data-models/keywords/
     * See "Additional Keywords"
     * Does not include all keywords listed in that links because some of them are supported by ajv https://ajv.js.org/json-schema.html#openapi-support
     * and some are explictly added within this class.
     */
    const {
      discriminator,
      example,
      externalDocs,
      xml,
      ...schemaObject
    } = schema;
    this.schemaObject = schemaObject;

    const ajvInstance = ajv(opts);
    ajvInstance.removeKeyword('writeOnly');
    ajvInstance.removeKeyword('readOnly');
    ajvInstance.addKeyword({
      keyword: 'writeOnly',
      validate: (schema: any) =>
        schema ? context.schemaContext === 'request' : true,
    });
    ajvInstance.getKeyword;
    ajvInstance.addKeyword({
      keyword: 'readOnly',
      validate: (schema: any) =>
        schema ? context.schemaContext === 'response' : true,
    });
    this.validator = ajvInstance.compile(schemaObject);
  }
  public validate(value: any) {
    const valid = this.validator(value);
    if (!valid) {
      const errors = betterAjvErrors(
        this.schemaObject,
        value || '',
        this.validator.errors!,
        { format: 'js', indent: 2 }
      );
      /**
       * In the case where betterAjvErrors accidently return 0 errors
       * we return raw errors
       */
      if (Array.isArray(errors) && errors.length > 0) {
        throw errors;
      }
      throw this.validator.errors;
    }
  }
}

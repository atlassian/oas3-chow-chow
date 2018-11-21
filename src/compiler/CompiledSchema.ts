import { SchemaObject } from 'openapi3-ts';
import * as Ajv from 'ajv';
import * as betterAjvErrors from 'better-ajv-errors';
import ajv from './ajv';

export default class CompiledSchema {
  private schemaObject?: SchemaObject;
  private validator: Ajv.ValidateFunction;

  constructor(schema: SchemaObject, opts?: Ajv.Options, context?: any) {
    this.schemaObject = schema;
    const ajvInstance = ajv(opts);
    ajvInstance.removeKeyword('writeOnly');
    ajvInstance.removeKeyword('readOnly');
    ajvInstance.addKeyword('writeOnly', {
      validate: (schema: any) => schema ? context.schemaContext === 'request' : true
    });
    ajvInstance.addKeyword('readOnly', {
      validate: (schema: any) => schema ? context.schemaContext === 'response' : true
    });
    this.validator = ajvInstance.compile(schema);
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

import { SchemaObject } from 'openapi3-ts';
import { ValidateFunction } from 'ajv';
import ajv from './ajv';

const noop: ValidateFunction = (data: any) => {
  return true;
}

export default class CompiledSchema {
  private validator: ValidateFunction;

  constructor(schema?: SchemaObject) {
    this.validator = schema ? ajv.compile(schema) : noop;
  }

  public validate(value: any) {
    const valid = this.validator(value);
    if (!valid) {
      console.log(this.validator.errors);
    }
  }
}

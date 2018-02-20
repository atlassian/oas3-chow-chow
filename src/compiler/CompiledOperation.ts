import { OperationObject, ParameterObject, RequestBodyObject } from 'openapi3-ts';
import CompiledParameter from './CompiledParameter';
import CompiledRequestBody from './CompiledRequestBody'
import { RequestMeta } from '.';

export default class CompiledOperation {
  private header?: {
    [key: string]: CompiledParameter;
  };
  private query?: {
    [key: string]: CompiledParameter;
  };
  private path?: {
    [key: string]: CompiledParameter;
  };
  private cookie?: {
    [key: string]: CompiledParameter;
  };
  private body?: CompiledRequestBody;

  constructor(operation: OperationObject) {
    for (const parameter of operation.parameters as ParameterObject[]) {
      switch(parameter.in) {
        case 'header':
          this.header = {
            ...this.header,
            [parameter.name]: new CompiledParameter(parameter)
          };
          break;
        case 'query':
          this.query = {
            ...this.query,
            [parameter.name]: new CompiledParameter(parameter)
          };
          break;
        case 'path':
          this.path = {
            ...this.path,
            [parameter.name]: new CompiledParameter(parameter)
          };
          break;
        case 'cookie':
          this.cookie = {
            ...this.cookie,
            [parameter.name]: new CompiledParameter(parameter)
          };
          break;
        default:
          throw new Error(`Unsupported Paramter Location: ${parameter.in}`)
      } 
    }

    if (operation.requestBody) {
      this.body = new CompiledRequestBody(operation.requestBody as RequestBodyObject);
    }
  }

  public validate(request: RequestMeta) {
    for (const key in this.header) {
      this.header[key].validate(request.header && request.header[key]);
    }
  }
}

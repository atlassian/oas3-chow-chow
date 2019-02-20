import { PathItemObject } from 'openapi3-ts';
import CompiledOperation from './CompiledOperation';
import { RequestMeta, ResponseMeta } from '.';
import ChowError from '../error';
import { ChowOptions } from '..';

export default class CompiledPathItem {
  private supportedMethod = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
  private compiledOperations: {
    [key: string]: CompiledOperation;
  } = {};
  private path: string;

  constructor(pathItemObject: PathItemObject, path: string, options: Partial<ChowOptions>) {
    this.compiledOperations = this.supportedMethod.reduce((compiled: any, method: string) => {
      const m = method.toLowerCase();
      if (pathItemObject[m]) { 
        compiled[m] = new CompiledOperation(pathItemObject[m], options);
      }
      return compiled;
    }, {})
    this.path = path;
  }

  public validateRequest(request: RequestMeta) {
    const method = request.method.toLowerCase();
    const compiledOperation = this.compiledOperations[method];
    if (!compiledOperation) {
      throw new ChowError(`Invalid request method - ${method}`, { in: 'path' })
    }

    return compiledOperation.validateRequest(request);
  }

  public validateResponse(response: ResponseMeta) {
    const method = response.method.toLowerCase();
    const compiledOperation = this.compiledOperations[method];
    if (!compiledOperation) {
      throw new ChowError(`Invalid request method - ${method}`, { in: 'path' })
    }

    return compiledOperation.validateResponse(response);
  }
}

import { PathItemObject } from 'openapi3-ts';
import CompiledOperation from './CompiledOperation';
import { RequestMeta } from '.';
import ChowError from '../error';

export default class CompiledPathItem {
  private supportedMethod = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
  private compiledOperations: {
    [key: string]: CompiledOperation;
  } = {};
  private path: string;

  constructor(pathItemObject: PathItemObject, path: string) {
    this.compiledOperations = this.supportedMethod.reduce((compiled: any, method: string) => {
      const m = method.toLowerCase();
      if (pathItemObject[m]) { 
        compiled[m] = new CompiledOperation(pathItemObject[m]);
      }
      return compiled;
    }, {})
    this.path = path;
  }

  public validate(request: RequestMeta) {
    const method = request.method.toLowerCase();
    const compiledOperation = this.compiledOperations[method];
    if (!compiledOperation) {
      throw new ChowError(`Invalid request method - ${method}`, { in: 'path', name: this.path })
    }

    return compiledOperation.validate(request);
  }
}

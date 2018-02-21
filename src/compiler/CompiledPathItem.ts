import { PathItemObject } from 'openapi3-ts';
import CompiledOperation from './CompiledOperation';
import { RequestMeta } from '.';

export default class CompiledPathItem {
  private supportedMethod = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
  private compiledOperations: {
    [key: string]: CompiledOperation;
  } = {};

  constructor(pathItemObject: PathItemObject) {
    this.compiledOperations = this.supportedMethod.reduce((compiled: any, method: string) => {
      const m = method.toLowerCase();
      if (pathItemObject[m]) { 
        compiled[m] = new CompiledOperation(pathItemObject[m]);
      }
      return compiled;
    }, {})
  }

  public validate(request: RequestMeta) {
    const method = request.method.toLowerCase();
    const compiledOperation = this.compiledOperations[method];
    if (!compiledOperation) {
      throw new Error(`Invalid request method - ${method}`)
    }

    return compiledOperation.validate(request);
  }
}

import { PathItemObject } from 'openapi3-ts';
import CompiledOperation from './CompiledOperation';
import { RequestMeta } from '.';

export default class CompiledPathItem {
  private supportedMethod = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
  private compiledOperations: {
    [key: string]: CompiledOperation;
  } = {};

  constructor(pathItemObject: PathItemObject) {
    this.compiledOperations = this.supportedMethod.reduce((compiled, method) => {
      compiled[method] = new CompiledOperation(pathItemObject[method]);
      return compiled;
    }, {})
  }

  public validate(request: RequestMeta) {
    const compiledOperation = this.compiledOperations[request.method];
    if (!compiledOperation) {
      throw new Error(`Invalid request method - ${request.method}`)
    }

    return compiledOperation.validate(request);
  }
}

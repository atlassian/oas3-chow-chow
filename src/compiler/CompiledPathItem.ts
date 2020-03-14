import { PathItemObject, ParameterObject } from 'openapi3-ts';
import CompiledOperation from './CompiledOperation';
import { RequestMeta, ResponseMeta } from '.';
import ChowError from '../error';
import { ChowOptions } from '..';

export type OperationRegisterFunc = (operationId: string, compiledOperation: CompiledOperation) => void;

export default class CompiledPathItem {
  static readonly SupportedMethod = <const>['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
  private compiledOperationsByMethod: Map<string, CompiledOperation> = new Map();
  private path: string;

  constructor(pathItemObject: PathItemObject, path: string, options: Partial<ChowOptions & { registerCompiledOperationWithId: OperationRegisterFunc }>) {
    CompiledPathItem.SupportedMethod.forEach(method => {
      const operationObject = pathItemObject[method];

      if (!operationObject) {
        return;
      }

      const compiledOperation = new CompiledOperation(
        operationObject,
        (pathItemObject.parameters as ParameterObject[]) || [],
        options
      );
      this.compiledOperationsByMethod.set(method, compiledOperation);

      if (operationObject.operationId && options.registerCompiledOperationWithId) {
        options.registerCompiledOperationWithId(operationObject.operationId, compiledOperation);
      }
    });

    this.path = path;
  }

  public getDefinedRequestBodyContentType(method: string): string[] {
    const m = method.toLowerCase();

    const compiledOperation = this.compiledOperationsByMethod.get(m);
    return !!compiledOperation ? compiledOperation.getDefinedRequestBodyContentType() : [];
  }

  public validateRequest(method: string, request: RequestMeta) {
    const mt = method.toLowerCase();
    const compiledOperation = this.compiledOperationsByMethod.get(mt);
    if (!compiledOperation) {
      throw new ChowError(`Invalid request method - ${mt}`, { in: 'path' })
    }

    return compiledOperation.validateRequest(request);
  }

  public validateResponse(method: string, response: ResponseMeta) {
    const mt = method.toLowerCase();
    const compiledOperation = this.compiledOperationsByMethod.get(mt);
    if (!compiledOperation) {
      throw new ChowError(`Invalid request method - ${mt}`, { in: 'path' })
    }

    return compiledOperation.validateResponse(response);
  }
}

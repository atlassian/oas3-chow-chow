import { OpenAPIObject } from 'openapi3-ts';
import compile, { RequestMeta, ResponseMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';
import ChowError from './error';

export { default as ChowError } from './error';

export default class ChowChow {
  private compiledPaths: CompiledPath[];

  constructor(document: OpenAPIObject) {
    this.compiledPaths = compile(document);
  }

  validateRequest(path: string, request: RequestMeta) {
    const compiledPath = this.identifyCompiledPath(path);
    return compiledPath.validateRequest(path, request);
  }

  validateResponse(path: string, response: ResponseMeta) {
    const compiledPath = this.identifyCompiledPath(path);
    return compiledPath.validateResponse(response);
  }

  private identifyCompiledPath(path: string) {
    const compiledPath = this.compiledPaths.find((cp: CompiledPath) => {
      return cp.test(path);
    });

    if (!compiledPath) {
      throw new ChowError(`No matches found for the given path - ${path}`, {in: 'paths', code: 404});
    }

    return compiledPath;
  }
}

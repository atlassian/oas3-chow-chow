import { OpenAPIObject } from 'openapi3-ts';
import compile, { RequestMeta, ResponseMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';
import ChowError from './error';

export default class ChowChow {
  private compiledPaths: CompiledPath[];

  constructor(document: OpenAPIObject) {
    this.compiledPaths = compile(document);
  }

  validateRequest(path: string, request: RequestMeta) {
    const compiledPath = this.identifyCompiledPath(path);
    return compiledPath.validateRequest(request);
  }

  validateResponse(path: string, response: ResponseMeta) {
    const compiledPath = this.identifyCompiledPath(path);
    return compiledPath.validateResponse(response);
  }

  private identifyCompiledPath(path: string) {
    const matches = this.compiledPaths.filter((compiledPath: CompiledPath) => {
      return compiledPath.match(path);
    });

    if (matches.length !== 1) {
      throw new ChowError(`No matches or multiple matches found for given path - ${path}`, {in: 'paths', name: ''});
    }

    return matches[0]; 
  }
}

import { OpenAPIObject } from 'openapi3-ts';
import compile, { RequestMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';
import ChowError from './error';

export default class ChowChow {
  private compiledPaths: CompiledPath[];

  constructor(document: OpenAPIObject) {
    this.compiledPaths = compile(document);
  }

  validateRequest(path: string, request: RequestMeta) {
    const matches = this.compiledPaths.filter((compiledPath: CompiledPath) => {
      return compiledPath.match(path);
    });

    if (matches.length !== 1) {
      throw new ChowError(`No matches or multiple matches found for given path - ${path}`, {in: 'paths', name: ''});
    }

    const compiledPath = matches[0];
    return compiledPath.validate(request);
  }
}

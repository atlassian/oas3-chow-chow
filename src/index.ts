import { OpenAPIObject } from 'openapi3-ts';
import compile, { RequestMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';

export default class ChowChow {
  private compiledPaths: CompiledPath[];

  constructor(document: OpenAPIObject) {
    this.compiledPaths = compile(document);
  }

  validateRequest(path: string, request: RequestMeta) {
    const matches = this.compiledPaths.filter((compiledPath: CompiledPath) => {
      return compiledPath.match(path);
    });
    
    switch(true) {
      case matches.length > 1:
        throw new Error(`More than 1 matcher found for given path - ${path}`);
      case matches.length < 1:
        throw new Error(`No matches found for given path - ${path}`);
    }

    const compiledPath = matches[0];
    return compiledPath.validate(request);
  }
}

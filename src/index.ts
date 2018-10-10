import { OpenAPIObject } from 'openapi3-ts';
import compile, { RequestMeta, ResponseMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';
import ChowError, { RequestValidationError, ResponseValidationError } from './error';

/**
 * Export Errors so that consumers can use it to ditinguish different error type.
 */
export { default as ChowError, RequestValidationError, ResponseValidationError } from './error';

export default class ChowChow {
  private compiledPaths: CompiledPath[];

  constructor(document: OpenAPIObject) {
    this.compiledPaths = compile(document);
  }

  validateRequest(path: string, request: RequestMeta) {
    try {
      const compiledPath = this.identifyCompiledPath(path);
      return compiledPath.validateRequest(path, request);
    } catch(err) {
      if (err instanceof ChowError) {
        throw new RequestValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
  }

  validateResponse(path: string, response: ResponseMeta) {
    try {
      const compiledPath = this.identifyCompiledPath(path);
      return compiledPath.validateResponse(response);
    } catch(err) {
      if (err instanceof ChowError) {
        throw new ResponseValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
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

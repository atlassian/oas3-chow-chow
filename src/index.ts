import { Options as AjvOptions } from 'ajv';
import { OpenAPIObject } from 'openapi3-ts';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import compile, { RequestMeta, ResponseMeta } from './compiler';
import CompiledPath from './compiler/CompiledPath';
import ChowError, {
  RequestValidationError,
  ResponseValidationError,
} from './error';
import CompiledOperation from './compiler/CompiledOperation';

/**
 * Export Errors so that consumers can use it to ditinguish different error type.
 */
export {
  default as ChowError,
  RequestValidationError,
  ResponseValidationError,
} from './error';

export interface ChowOptions {
  headerAjvOptions: AjvOptions;
  cookieAjvOptions: AjvOptions;
  pathAjvOptions: AjvOptions;
  queryAjvOptions: AjvOptions;
  requestBodyAjvOptions: AjvOptions;
  responseBodyAjvOptions: AjvOptions;
}

export default class ChowChow {
  private compiledPaths: CompiledPath[];
  private compiledOperationById: Map<string, CompiledOperation>;

  public static async create(document: object, options: Partial<ChowOptions> = {}) {
    const res = await $RefParser.dereference(document, {
      continueOnError: false,
      resolve: {
        external: false
      },
      dereference: {
        circular: false
      }
    });

    return new ChowChow(res as OpenAPIObject, options);
  }

  constructor(document: OpenAPIObject, options: Partial<ChowOptions> = {}) {
    const { compiledPaths, compiledOperationById } = compile(document, options);
    this.compiledPaths = compiledPaths;
    this.compiledOperationById = compiledOperationById;
  }

  validateRequestByPath(path: string, method: string, request: RequestMeta) {
    try {
      const compiledPath = this.identifyCompiledPath(path);
      return compiledPath.validateRequest(path, method, request);
    } catch (err) {
      if (err instanceof ChowError) {
        throw new RequestValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
  }

  validateResponseByPath(path: string, method: string, response: ResponseMeta) {
    try {
      const compiledPath = this.identifyCompiledPath(path);
      return compiledPath.validateResponse(method, response);
    } catch (err) {
      if (err instanceof ChowError) {
        throw new ResponseValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
  }

  validateRequestByOperationId(operationId: string, request: RequestMeta) {
    const compiledOperation = this.compiledOperationById.get(operationId);

    if (!compiledOperation) {
      throw new ChowError(
        `No matches found for the given operationId - ${operationId}`,
        { in: 'request', code: 404 }
      );
    }

    try {
      return compiledOperation.validateRequest(request);
    } catch (err) {
      if (err instanceof ChowError) {
        throw new RequestValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
  }

  validateResponseByOperationId(operationId: string, response: ResponseMeta) {
    const compiledOperation = this.compiledOperationById.get(operationId);

    if (!compiledOperation) {
      throw new ChowError(
        `No matches found for the given operationId - ${operationId}`,
        { in: 'response', code: 404 }
      );
    }

    try {
      return compiledOperation.validateResponse(response);
    } catch (err) {
      if (err instanceof ChowError) {
        throw new ResponseValidationError(err.message, err.meta);
      } else {
        throw err;
      }
    }
  }

  getDefinedRequestBodyContentType(path: string, method: string) {
    try {
      const compiledPath = this.identifyCompiledPath(path);
      return compiledPath.getDefinedRequestBodyContentType(method);
    } catch (err) {
      if (err instanceof ChowError) {
        return [];
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
      throw new ChowError(`No matches found for the given path - ${path}`, {
        in: 'paths',
        code: 404,
      });
    }

    return compiledPath;
  }
}

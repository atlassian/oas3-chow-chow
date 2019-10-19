import { PathItemObject } from 'openapi3-ts';
import CompiledPathItem, { OperationRegisterFunc } from './CompiledPathItem';
import { RequestMeta, ResponseMeta } from '.';
import * as XRegExp from 'xregexp';
import { ChowOptions } from '..';

interface PathParameters {
  [key: string]: string;
}

export default class CompiledPath {
  private path: string;
  private regex: RegExp;
  private compiledPathItem: CompiledPathItem;
  private ignoredMatches = ['index', 'input']; 

  constructor(path: string, pathItemObject: PathItemObject, options: Partial<ChowOptions & { registerCompiledOperationWithId: OperationRegisterFunc }>) {
    this.path = path;
    /**
     * The following statement should create Named Capturing Group for
     * each path parameter, for example
     * /pets/{petId} => ^/pets/(?<petId>[^/]+)/?$
     */
    this.regex = XRegExp('^'+  path.replace(/\{([^}]*)}/g, '(?<$1>[^/]+)') + '/?$'),
    this.compiledPathItem = new CompiledPathItem(pathItemObject, path, options);
  }

  public getDefinedRequestBodyContentType(method: string): string[] {
    return this.compiledPathItem.getDefinedRequestBodyContentType(method);
  }

  public test(path: string): boolean {
    return XRegExp.test(path, this.regex);
  }

  public validateRequest(path: string, method: string, request: RequestMeta) {
    return this.compiledPathItem.validateRequest(method, {
      ...request,
      path: this.extractPathParams(path)
    });
  }

  public validateResponse(method: string, response: ResponseMeta) {
    return this.compiledPathItem.validateResponse(method, response);
  }

  private extractPathParams = (path: string): PathParameters => {
    const matches = XRegExp.exec(path, this.regex);

    // extract path parameters
    return Object.keys(matches)
      .filter(this.matchFilter.bind(this))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: matches[key as any]
        };
      }, {});
  }

  private matchFilter = (key: string) => {
    return isNaN(parseInt(key)) && !this.ignoredMatches.includes(key) 
  }
}

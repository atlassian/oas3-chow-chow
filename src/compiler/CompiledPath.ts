import { PathItemObject } from 'openapi3-ts';
import CompiledPathItem from './CompiledPathItem';
import { RequestMeta, ResponseMeta } from '.';

export default class CompiledPath {
  private path: string;
  private regex: RegExp;
  private compiledPathItem: CompiledPathItem;

  constructor(path: string, regex: RegExp, pathItemObject: PathItemObject) {
    this.path = path;
    this.regex = regex;
    this.compiledPathItem = new CompiledPathItem(pathItemObject, path);
  }

  public match(path: string): boolean {
    return this.regex.test(path);
  }

  public validateRequest(request: RequestMeta) {
    return this.compiledPathItem.validateRequest(request);
  }

  public validateResponse(response: ResponseMeta) {
    return this.compiledPathItem.validateResponse(response);
  }
}

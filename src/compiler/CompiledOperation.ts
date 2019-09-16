import { OperationObject, ParameterObject, RequestBodyObject } from 'openapi3-ts';
import CompiledRequestBody from './CompiledRequestBody'
import CompiledResponse from './CompiledResponse';
import { RequestMeta, ResponseMeta } from '.';
import ChowError from '../error';
import CompiledParameterHeader from './CompiledParameterHeader';
import CompiledParameterQuery from './CompiledParameterQuery';
import CompiledParameterPath from './CompiledParameterPath';
import CompiledParameterCookie from './CompiledParameterCookie';
import CompiledMediaType from './CompiledMediaType';
import { ChowOptions } from '..';

export default class CompiledOperation {
  private header: ParameterObject[] = [];
  private compiledHeader: CompiledParameterHeader;
  private query: ParameterObject[] = [];
  private compiledQuery: CompiledParameterQuery;
  private path: ParameterObject[] = [];
  private compiledPath: CompiledParameterPath;
  private cookie: ParameterObject[] = [];
  private compiledCookie: CompiledParameterCookie;
  private body?: CompiledRequestBody;
  private operationId?: string;
  private response: {
    [key: string]: CompiledResponse;
  } = {};

  constructor(operation: OperationObject, options: Partial<ChowOptions>) {
    const parameters = !!operation.parameters ? [...operation.parameters] : []
    for (const parameter of parameters as ParameterObject[]) {
      switch(parameter.in) {
        case 'header':
          this.header.push(parameter);
          break;
        case 'query':
          this.query.push(parameter);
          break;
        case 'path':
          this.path.push(parameter);
          break;
        case 'cookie':
          this.cookie.push(parameter);
          break;
      }
    }
    this.compiledHeader = new CompiledParameterHeader(this.header, options);
    this.compiledQuery = new CompiledParameterQuery(this.query, options);
    this.compiledPath = new CompiledParameterPath(this.path, options);
    this.compiledCookie = new CompiledParameterCookie(this.cookie, options);

    if (operation.requestBody) {
      this.body = new CompiledRequestBody(operation.requestBody as RequestBodyObject);
    }

    this.operationId = operation.operationId;

    this.response = Object.keys(operation.responses).reduce((compiled: any, status: string) => {
      compiled[status] = new CompiledResponse(operation.responses[status]);
      return compiled;
    }, {});
  }

  public getDefinedRequestBodyContentType(): string[] {
    return this.body ? this.body.getDefinedContentTypes() : [];
  }

  public validateRequest(request: RequestMeta): RequestMeta {
    const header = this.compiledHeader.validate(request.header);
    const query = this.compiledQuery.validate(request.query);
    const path = this.compiledPath.validate(request.path);
    const cookie = this.compiledCookie.validate(request.cookie);

    let body;
    if (this.body) {
      const contentType = CompiledMediaType.extractMediaType(request.header && request.header['content-type']);
      body = this.body.validate(contentType, request.body);
    }

    return {
      method: request.method,
      operationId: request.operationId || this.operationId,
      header,
      query,
      path,
      cookie,
      body
    };
  }

  public validateResponse(response: ResponseMeta): ResponseMeta {
    const compiledResponse = this.response[response.status] || this.response['default'];
    if (compiledResponse) {
      return {...response, body: compiledResponse.validate(response)};
    } else {
      throw new ChowError('Unsupported Response Status Code', { in: 'response' });
    }
  }
}

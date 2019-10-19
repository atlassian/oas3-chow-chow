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
  private header: Map<string, ParameterObject> = new Map();
  private compiledHeader: CompiledParameterHeader;
  private query: Map<string, ParameterObject> = new Map();
  private compiledQuery: CompiledParameterQuery;
  private path: Map<string, ParameterObject> = new Map();
  private compiledPath: CompiledParameterPath;
  private cookie: Map<string, ParameterObject> = new Map();
  private compiledCookie: CompiledParameterCookie;
  private body?: CompiledRequestBody;
  private operationId?: string;
  private response: {
    [key: string]: CompiledResponse;
  } = {};

  constructor(operation: OperationObject, inheritedParameter: ParameterObject[], options: Partial<ChowOptions>) {
    const parameters = !!operation.parameters ? [...inheritedParameter, ...operation.parameters] : [...inheritedParameter];
    for (const parameter of parameters as ParameterObject[]) {
      switch(parameter.in) {
        case 'header':
          this.header.set(parameter.name, parameter);
          break;
        case 'query':
          this.query.set(parameter.name, parameter);
          break;
        case 'path':
          this.path.set(parameter.name, parameter);
          break;
        case 'cookie':
          this.cookie.set(parameter.name, parameter);
          break;
      }
    }
    this.compiledHeader = new CompiledParameterHeader(Array.from(this.header.values()), options);
    this.compiledQuery = new CompiledParameterQuery(Array.from(this.query.values()), options);
    this.compiledPath = new CompiledParameterPath(Array.from(this.path.values()), options);
    this.compiledCookie = new CompiledParameterCookie(Array.from(this.cookie.values()), options);

    if (operation.requestBody) {
      this.body = new CompiledRequestBody(operation.requestBody as RequestBodyObject, options);
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

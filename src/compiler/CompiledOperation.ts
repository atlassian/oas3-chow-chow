import { OperationObject, ParameterObject, RequestBodyObject } from 'openapi3-ts';
import CompiledParameter from './CompiledParameter';
import CompiledRequestBody from './CompiledRequestBody'
import CompiledResponse from './CompiledResponse';
import { RequestMeta, ResponseMeta } from '.';
import ChowError from '../error';
import CompiledParameterHeader from './CompiledParameterHeader';
import CompiledParameterQuery from './CompiledParameterQuery';
import CompiledParameterPath from './CompiledParameterPath';

export default class CompiledOperation {
  private header: ParameterObject[] = [];
  private compiledHeader: CompiledParameterHeader;
  private query: ParameterObject[] = [];
  private compiledQuery: CompiledParameterQuery;
  private path: ParameterObject[] = [];
  private compiledPath: CompiledParameterPath;
  private cookie: {
    [key: string]: CompiledParameter;
  } = {};
  private body?: CompiledRequestBody;
  private response: {
    [key: string]: CompiledResponse;
  } = {};

  constructor(operation: OperationObject) {
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
          this.cookie = {
            ...this.cookie,
            [parameter.name]: new CompiledParameter(parameter)
          };
          break;
        default:
          throw new ChowError(`Unsupported Paramter Location`, { in: parameter.in, name: ''})
      } 
    }
    this.compiledHeader = new CompiledParameterHeader(this.header);
    this.compiledQuery = new CompiledParameterQuery(this.query);
    this.compiledPath = new CompiledParameterPath(this.path);

    if (operation.requestBody) {
      this.body = new CompiledRequestBody(operation.requestBody as RequestBodyObject);
    }

    this.response = Object.keys(operation.responses).reduce((compiled: any, status: string) => {
      compiled[status] = new CompiledResponse(operation.responses[status]);
      return compiled;
    }, {});
  }

  public validateRequest(request: RequestMeta) {
    this.compiledHeader.validate(request.header);
    this.compiledQuery.validate(request.query);
    this.compiledPath.validate(request.path);

    for (const key in this.cookie) {
      this.cookie[key].validate(request.cookie && request.cookie[key]);
    }

    if (this.body) {
      this.body.validate(request.header && request.header['content-type'], request.body);
    }
  }

  public validateResponse(response: ResponseMeta) {
    const compiledResponse = this.response[response.status] || this.response['default'];
    if (compiledResponse) {
      compiledResponse.validate(response);
    } else {
      throw new ChowError('Unsupported Response Status Code', { in: 'Response', name: '' });
    }
  }
}

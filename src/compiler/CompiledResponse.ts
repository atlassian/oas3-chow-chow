import { ResponseObject, HeaderObject, MediaTypeObject } from 'openapi3-ts';
import ChowError from '../error';
import CompiledHeader from './CompiledHeader';
import compile, { ResponseMeta } from '.';
import CompiledMediaType from './CompiledMediaType';

export default class CompiledResponse {
  private headers: {
    [key: string]: CompiledHeader
  } = {};

  private content: {
    [key: string]: CompiledMediaType
  } = {};

  constructor(response: ResponseObject) {
    if (response.headers) {
      this.headers = Object.keys(response.headers).reduce((compiled: any, name: string) => {
        compiled[name] = new CompiledHeader({
          ...response.headers![name] as HeaderObject,
          name
        });
        return compiled;
      }, {});
    }

    if (response.content) {
      this.content = Object.keys(response.content).reduce((compiled: any, name: string) => {
        compiled[name] = new CompiledMediaType(name, response.content![name] as MediaTypeObject);
        return compiled;
      }, {});
    }
  }

  public validate(response: ResponseMeta) {
    const headers = response.header || {};

    for (const key in this.headers) {
      this.headers[key].validate(headers[key]);
    }

    if (this.content[headers['content-type']]) {
      this.content[headers['content-type']].validate(response.body);
    } else {
      throw new ChowError('Unsupported Response Media Type', { in: 'Response', name: '' })
    }
  }
}

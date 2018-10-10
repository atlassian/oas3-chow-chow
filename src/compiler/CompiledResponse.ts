import { ResponseObject, HeaderObject, MediaTypeObject } from 'openapi3-ts';
import ChowError from '../error';
import CompiledResponseHeader from './CompiledResponseHeader';
import { ResponseMeta } from '.';
import CompiledMediaType from './CompiledMediaType';

export default class CompiledResponse {
  private compiledResponseHeader: CompiledResponseHeader;
  private content: {
    [key: string]: CompiledMediaType
  } = {};

  constructor(response: ResponseObject) {
    this.compiledResponseHeader = new CompiledResponseHeader(response.headers);

    if (response.content) {
      this.content = Object.keys(response.content).reduce((compiled: any, name: string) => {
        compiled[name] = new CompiledMediaType(name, response.content![name] as MediaTypeObject);
        return compiled;
      }, {});
    }
  }

  public validate(response: ResponseMeta) {
    this.compiledResponseHeader.validate(response.header);

    const contentType = CompiledMediaType.extractMediaType(response.header['content-type']);
    /**
     * In the case where there is no Content-Type header. For example 204 status.
     */
    if (!contentType) {
      return response.body;
    }

    if (this.content[contentType]) {
      return this.content[contentType].validate(response.body);
    } else {
      throw new ChowError('Unsupported Response Media Type', { in: 'response' })
    }
  }
}

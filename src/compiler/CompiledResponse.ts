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

    if (this.content[response.header['content-type']]) {
      this.content[response.header['content-type']].validate(response.body);
    } else {
      throw new ChowError('Unsupported Response Media Type', { in: 'response' })
    }
  }
}

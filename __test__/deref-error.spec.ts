import ChowChow from '../src';
import ChowError, { ResponseValidationError } from '../src/error';
import {ResponseMeta} from '../src/compiler';

const fixture = require('./fixtures/deref-error.json');

describe('Deref Error', () => {
  it('should throw a proper error', () => {
    expect(() => new ChowChow(fixture)).toThrow('Missing $ref: #/components/schemas/blahBlahBlah');
  });
});

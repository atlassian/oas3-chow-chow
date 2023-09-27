import ChowChow from '../src';

const fixture = require('./fixtures/deref-error.json');

describe('Deref Error', () => {
  it('should throw a proper error', async () => {
    await expect(ChowChow.create(fixture)).rejects.toMatchInlineSnapshot(
      `[MissingPointerError: Token "blahBlahBlah" does not exist.]`
    );
  });
});

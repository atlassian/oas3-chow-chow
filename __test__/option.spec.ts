import ChowChow from '../src';

describe('Option Body', () => {
  it('throw with unknown format', async () => {
    const fixture = require('./fixtures/option-unknown-fmt.json');

    await expect(ChowChow.create(fixture)).rejects.toMatchInlineSnapshot(
      `[Error: unknown format "pet-name" ignored in schema at path "#/properties/name"]`
    );
  });

  it('success with unknown format if unknown format is allowed', async () => {
    const fixture = require('./fixtures/option-unknown-fmt.json');

    await expect(
      ChowChow.create(fixture, {
        responseBodyAjvOptions: {
          formats: {
            'pet-name': true,
          },
        },
      })
    ).resolves.toBeTruthy();
  });
});

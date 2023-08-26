import ChowChow from '../src';

describe('Option Body', () => {
  it('throw with unknown format', () => {
    const fixture = require('./fixtures/option-unknown-fmt.json');

    expect(() => {
      new ChowChow(fixture);
    }).toThrow(
      'unknown format "pet-name" ignored in schema at path "#/properties/name"'
    );
  });

  it('success with unknown format if unknown format is allowed', () => {
    const fixture = require('./fixtures/option-unknown-fmt.json');

    expect(() => {
      new ChowChow(fixture, {
        responseBodyAjvOptions: {
          formats: {
            'pet-name': true,
          },
        },
      });
    }).not.toThrow();
  });
});

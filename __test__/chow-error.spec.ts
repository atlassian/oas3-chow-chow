import ChowError from '../src/error';

describe('ChowError', () => {
  it('should be able to initialize a ChowError', () => {
    const chowError = new ChowError('An error', { in: 'test' });
    expect(chowError.toJSON()).toMatchInlineSnapshot(`
      {
        "code": 400,
        "location": {
          "in": "test",
        },
        "message": "An error",
        "suggestions": [],
      }
    `);
  });

  it('should be able to output JSON format of the error', () => {
    const chowError = new ChowError('An error', { in: 'test' });
    expect(chowError.toJSON()).toMatchInlineSnapshot(`
      {
        "code": 400,
        "location": {
          "in": "test",
        },
        "message": "An error",
        "suggestions": [],
      }
    `);
  });
});

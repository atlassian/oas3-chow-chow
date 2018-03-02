import ChowError from '../src/error';

describe('ChowError', () => {
  it('should be able to initialize a ChowError', () => {
    const chowError = new ChowError('An error', { in: 'test', name: 'test' });
  })

  it('should be able to output JSON format of the error', () => {
    const chowError = new ChowError('An error', { in: 'test', name: 'test' });
    expect(chowError.toJSON()).toEqual({
      location: {
        in: 'test',
        name: 'test',
      },
      message: 'An error',
      rawErrors: []
    });
  })
})

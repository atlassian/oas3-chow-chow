import ChowChow from '../src';
import ChowError from '../src/error';
const pathFixture = require('./fixtures/path.json');
const parameterInPathLevelFixture = require('./fixtures/parameter-in-path-level.json');
const parameterInBothOperationAndPathFixture = require('./fixtures/parameter-in-both-operation-and-path-level.json');

describe('Path', () => {
  describe('Parameter in Operation level', () => {
    let chowchow: ChowChow;

    beforeAll(async () => {
      chowchow = await ChowChow.create(pathFixture);
    });

    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {};
      expect(
        chowchow.validateRequestByPath('/pets/123', 'get', pathMeta)
      ).toEqual(
        expect.objectContaining({
          path: {
            petId: 123,
          },
        })
      );
    });

    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/abc', 'get', {});
      }).toThrowError(ChowError);
    });
  });

  describe('Parameter in Path level', () => {
    let chowchow: ChowChow;

    beforeAll(async () => {
      chowchow = await ChowChow.create(parameterInPathLevelFixture);
    });

    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {};
      expect(
        chowchow.validateRequestByPath('/pets/123', 'get', pathMeta)
      ).toEqual(
        expect.objectContaining({
          path: {
            petId: 123,
          },
        })
      );
    });

    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/abc', 'get', {});
      }).toThrowError(ChowError);
    });
  });

  describe('Parameter in Operation level should override Path level', () => {
    let chowchow: ChowChow;

    beforeAll(async () => {
      chowchow = await ChowChow.create(parameterInBothOperationAndPathFixture);
    });

    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {};
      expect(
        chowchow.validateRequestByPath('/pets/123', 'get', pathMeta)
      ).toEqual(
        expect.objectContaining({
          path: {
            petId: 123,
          },
        })
      );
    });

    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequestByPath('/pets/abc', 'get', {});
      }).toThrowError(ChowError);
    });
  });
});

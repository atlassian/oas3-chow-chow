import ChowChow from '../src';
import ChowError from '../src/error';
const pathFixture = require('./fixtures/path.json');
const parameterInPathLevelFixture = require('./fixtures/parameter-in-path-level.json');
const parameterInBothOperationAndPathFixture = require('./fixtures/parameter-in-both-operation-and-path-level.json');

describe('Path', () => {
  describe('Parameter in Operation level', () => {
    let chowchow: ChowChow;
  
    beforeAll(() => {
      chowchow = new ChowChow(pathFixture);
    })
  
    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {
        method: 'get'
      };
      expect(chowchow.validateRequest('/pets/123', pathMeta)).toEqual(expect.objectContaining({
        path: {
          petId: 123
        }
      }));
    });
  
    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequest('/pets/abc', {
          method: 'get'
        });
      }).toThrowError(ChowError); 
    })
  })

  describe('Parameter in Path level', () => {
    let chowchow: ChowChow;
  
    beforeAll(() => {
      chowchow = new ChowChow(parameterInPathLevelFixture);
    })
  
    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {
        method: 'get'
      };
      expect(chowchow.validateRequest('/pets/123', pathMeta)).toEqual(expect.objectContaining({
        path: {
          petId: 123
        }
      }));
    });
  
    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequest('/pets/abc', {
          method: 'get'
        });
      }).toThrowError(ChowError); 
    })
  })

  describe('Parameter in Operation level should override Path level', () => {
    let chowchow: ChowChow;
  
    beforeAll(() => {
      chowchow = new ChowChow(parameterInBothOperationAndPathFixture);
    })
  
    it('should validate the path parameters and coerce to the correct type', () => {
      const pathMeta = {
        method: 'get'
      };
      expect(chowchow.validateRequest('/pets/123', pathMeta)).toEqual(expect.objectContaining({
        path: {
          petId: 123
        }
      }));
    });
  
    it('should throw error if path parameter fails schema check', () => {
      expect(() => {
        chowchow.validateRequest('/pets/abc', {
          method: 'get'
        });
      }).toThrowError(ChowError); 
    })
  })
})

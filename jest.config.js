module.exports = {
  preset: 'ts-jest',
  globals: {
      'ts-jest': {
          tsconfig: 'tsconfig.json'
      }
  },
  "roots": [
      "<rootDir>/src",
      "<rootDir>__test__"
  ],
  "testRegex": "\.(test|spec){1}\\.ts?$",
  "moduleFileExtensions": [
      "ts",
      "js",
      "jsx",
      "json",
      "node"
  ],
  "setupFilesAfterEnv": [
      './jest.setup.js'
  ],
  "testEnvironment": 'node'
};

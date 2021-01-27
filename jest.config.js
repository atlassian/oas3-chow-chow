module.exports = {
  preset: 'ts-jest',
  globals: {
      'ts-jest': {
          tsconfig: 'tsconfig.json'
      }
  },
  roots: [
      "<rootDir>/src",
      "<rootDir>__test__"
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  testEnvironment: 'node',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};

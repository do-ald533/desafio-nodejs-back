module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageReporters: ['json', 'lcov'],
  coverageDirectory: './coverage',
  roots: ['<rootDir>/tests/integration', '<rootDir>/tests/unit'],
  transform: {
    'ˆ.+\\.tsx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          target: 'es2021',
        },
        sourceMaps: true,
        module: {
          type: 'es6',
          noInterop: false,
        },
      },
    ],
  },
  testRegex: '(/__test__/.*|(\\.|/)(tests|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
};

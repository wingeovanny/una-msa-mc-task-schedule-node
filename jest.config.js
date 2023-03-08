module.exports = {
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
  collectCoverageFrom: ['src/**/*.service.ts', 'src/**/*.controller.ts'],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'lcov'],
  coveragePathIgnorePatterns: ['modules/meta-service'],
  setupFiles: ['./test/setup-tests.ts'],
};

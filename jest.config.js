module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'utils/**/*.js',
    ],
    coverageDirectory: 'coverage/backend', // Directory to save coverage reports
    coverageReporters: ['text', 'html'], // Coverage report formats
    testEnvironment: 'node', // For backend testing
    testMatch: [
        '**/jest/**/*Test.jest.js',
    ],
};
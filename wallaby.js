module.exports = function () {
  return {
    files: [
      'src/**/*.js',
      'tests/teardown.js',
      { pattern: '.env', instrument: false },
      { pattern: '.env.example', instrument: false },
      { pattern: 'lib/**/*.js', instrument: false },
    ],

    filesWithNoCoverageCalculated: [
      'lib/**/*.js',
      'src/app.js',
      'src/database.js',
      'src/server.js',
      'tests/teardown.js',
    ],

    tests: [
      'tests/**/*.spec.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};

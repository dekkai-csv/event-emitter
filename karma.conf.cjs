module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai'],
        basePath: '.',
        files: [
            {
                pattern: 'spec/env/browser.suite.js',
                type: 'module',
            },
            {
                pattern: 'spec/**/*.spec.js',
                type: 'module',
                included: false,
            },
            {
                pattern: 'build/dist/**/*.js',
                type: 'module',
                included: false,
            },
        ],
        reporters: ['mocha'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        // singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
    })
}

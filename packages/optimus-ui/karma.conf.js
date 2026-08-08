// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter'), require('karma-coverage'), require('karma-junit-reporter'), require('@angular-devkit/build-angular/plugins/karma')],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
            jasmine: {
                random: false,
                stopOnFailure: true
            }
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/optimus-ui'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }]
        },
        junitReporter: {
            outputDir: require('path').join(__dirname, './reports/junit'),
            outputFile: 'jasmine.xml',
            useBrowserName: false // keep test ids runner-agnostic so both suites can be compared
        },
        reporters: ['progress', 'kjhtml', 'junit'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless']
    });
};

require('babel-core/register')({
  presets: [
    'react',
    'es2015',
    'stage-0',
  ],
  plugins: ['transform-decorators-legacy'],
});

const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

// Grab server port from package.json
const serverPort = '3007'; // process.env.npm_package_betterScripts_start_dev_server_env_PORT;

const reporter = new HtmlScreenshotReporter({
  dest: 'protractor-screenshots',
  filename: 'index.html',
});

const seleniumConfig = process.env.JENKINS_URL ?
  {
    seleniumAddress: 'http://localhost:4444/wd/hub',
  } : {
    seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
    directConnect: true,
    chromeOptions: {
      binary: '/usr/bin/google-chrome-stable',
      args: ['--lang=nl', '--window-size=1024,768', '--no-sandbox'],
    },
  };

exports.config = Object.assign(
  {},
  {
    specs: ['./src/**/*.e2e.js'],
    baseUrl: `http://localhost:${serverPort}`,

    framework: 'jasmine2',
    jasmineNodeOpts: {
      isVerbose: true,
    },
    onPrepare: () => {
      browser.ignoreSynchronization = true;
      jasmine.getEnv().addReporter(reporter);

      browser.manage().timeouts().pageLoadTimeout(10000);
      browser.manage().timeouts().implicitlyWait(3000);

      browser.driver.manage().window().setSize(1024, 768);

      return browser.get(`http://localhost:${serverPort}`);
    },

    beforeLaunch: () => new Promise(resolve => {
      reporter.beforeLaunch(resolve);
    }),

    afterLaunch: exitCode => new Promise(resolve => {
      reporter.afterLaunch(resolve.bind(this, exitCode));
    }),
  },
  seleniumConfig
);

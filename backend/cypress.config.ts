import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    env: {
      // Test user credentials
      adminUsername: 'admin',
      adminPassword: 'admin',
      teacherUsername: 'teacher',
      teacherPassword: 'teacher',
      studentUsername: 'student',
      studentPassword: 'student',

      // API endpoints
      apiUrl: 'http://localhost:8080/api',

      // Test data
      testCourseCode: 'E2E-TEST-001',
      testQuizTitle: 'E2E Test Quiz',
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/component.ts',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },

  // Global configuration
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  experimentalStudio: true,

  // Retry configuration
  retries: {
    runMode: 2,
    openMode: 0,
  },
});

const { defineConfig } = require('cypress');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://trello.com',
    
    // Configure Mochawesome reporter
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
      timestamp: 'mmddyyyy_HHMMss',
      reportFilename: '[status]_[datetime]-[name]-report',
      quiet: true
    },

    setupNodeEvents(on, config) {
      config.env.TRELLO_EMAIL = process.env.TRELLO_EMAIL;
      config.env.TRELLO_PASSWORD = process.env.TRELLO_PASSWORD;
      config.env.TRELLO_API_KEY = process.env.TRELLO_API_KEY;
      config.env.TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;

      console.log('Environment loaded:', {
        hasEmail: !!process.env.TRELLO_EMAIL,
        hasPassword: !!process.env.TRELLO_PASSWORD,
        hasApiKey: !!process.env.TRELLO_API_KEY,
        hasApiToken: !!process.env.TRELLO_API_TOKEN
      });

      return config;
    },
  },
});


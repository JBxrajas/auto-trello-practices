const { defineConfig } = require('cypress');
const path = require('path');

// Explicitly load .env from this directory
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://trello.com',
    setupNodeEvents(on, config) {
      config.env.TRELLO_EMAIL = process.env.TRELLO_EMAIL;
      config.env.TRELLO_PASSWORD = process.env.TRELLO_PASSWORD;
      config.env.TRELLO_API_KEY = process.env.TRELLO_API_KEY;
      config.env.TRELLO_API_TOKEN = process.env.TRELLO_API_TOKEN;

      // Debug: verify token is loaded correctly
      console.log('Loading .env from:', path.resolve(__dirname, '.env'));
      console.log('Loaded API Token:', process.env.TRELLO_API_TOKEN?.substring(0, 15) + '...');

      return config;
    },
  },
});


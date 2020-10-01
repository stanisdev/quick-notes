'use strict';

const config = {
  development: {
    username: 'node',
    password: process.env.DB_PASSWORD,
    database: 'quick_notes',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: console.log
  },
  test: {
    username: 'node',
    password: process.env.DB_PASSWORD,
    database: 'quick_notes_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: '?',
    password: process.env.DB_PASSWORD,
    database: '?',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: console.log
  }
};

module.exports = config;
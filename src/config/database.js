'use strict';

const config = {
  development: {
    username: 'node',
    password: process.env.DB_PASSWORD,
    database: 'quick_notes',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'node',
    password: process.env.DB_PASSWORD,
    database: 'quick_notes',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};

module.exports = config;
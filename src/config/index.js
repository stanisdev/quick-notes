'use strict';

const { dirname, join } = require('path');
const rootDir = dirname(__dirname);
const port = process.env.PORT || 5000;

const config = {
  port,
  loadersDir: join(rootDir, 'loaders'),
  routesDir: join(rootDir, 'routes'),
  modelsDir: join(rootDir, 'models'),
  servicesDir: join(rootDir, 'services'),
  middlewaresDir: join(rootDir, 'middlewares'),
  jwt: {
    secretKey: 'XeyjzSwLzarcLkmkyCR7A2zYfdTCcL',
    expiration: '?' // @todo: use it
  }
};

module.exports = config;
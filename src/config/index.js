'use strict';

const { dirname, join } = require('path');
const rootDir = dirname(__dirname);
const { merge } = require('lodash');
const env = process.env.NODE_ENV || 'development';

const envs = {
  development: {
    port: process.env.PORT || 5000
  },
  test: {
    port: 5001
  },
  production: {
    port: 6000
  }
}

const config = {
  loadersDir: join(rootDir, 'loaders'),
  routesDir: join(rootDir, 'routes'),
  modelsDir: join(rootDir, 'models'),
  servicesDir: join(rootDir, 'services'),
  middlewaresDir: join(rootDir, 'middlewares'),
  jwt: {
    secretKey: 'XeyjzSwLzarcLkmkyCR7A2zYfdTCcL',
    expiration: 60 * 60 // 1 hour
  },
  notes: {
    limit: {
      default: 10,
      maximum: 30
    }
  }
};

module.exports = merge(config, envs[env]);
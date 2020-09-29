'use strict';

const { dirname, join } = require('path');
const rootDir = dirname(__dirname);
const port = process.env.PORT || 5000;

const config = {
  port,
  loadersDir: join(rootDir, 'loaders'),
  routesDir: join(rootDir, 'routes'),
  modelsDir: join(rootDir, 'models'),
  servicesDir: join(rootDir, 'services')
};

module.exports = config;
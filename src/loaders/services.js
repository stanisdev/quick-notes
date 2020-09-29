'use strict';

const fs = require('fs');
const { join } = require('path');

const services = (app) => {
  const { servicesDir } = app.get('config');
  const services = {};
  fs.readdirSync(servicesDir).forEach(file => {
    
    const filePath = join(servicesDir, file);
    const serviceName = file.slice(0, -3);
    services[serviceName] = require(filePath);
  });

  app.set('services', services);
};

module.exports = services;
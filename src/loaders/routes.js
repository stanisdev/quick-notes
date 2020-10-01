'use strict';

const fs = require('fs');
const { join, dirname } = require('path');

class Routes {
  constructor(app) {
    this.services = app.get('services');
    this.config = app.get('config');
    this.db = app.get('db');
    this.app = app;
  }

  /**
   * Start appointing the endpoints
   */
  init() {
    const { routesDir } = this.config;

    fs.readdirSync(routesDir).forEach(dirName => {
      const routeDir = join(routesDir, dirName);
      const Class = require(routeDir);
      const validators = require(join(routeDir, 'validators'));

      const instance = new Class(this);

      Object.getOwnPropertyNames(Class.prototype)
      .filter(method => method != 'constructor')
      .forEach(metaData => {
        this.#setEndpoint(metaData, instance, validators)
      });
    });
  }

  /**
   * Set an endpoint
   */
  #setEndpoint(metaData, instance, validators) {
    const { wrapper, validate } = this.services;
    const [httpMethod, url, , ...middlewares] = metaData.split(/\s+/);
    const prefix = instance.prefix;

    const [validatorName] = metaData.split(' |');
    const validator = validators[validatorName];
    const handler = wrapper(instance[metaData].bind(instance));

    const params = [prefix + url];
    if (validator instanceof Object) {
      params.push(
        validate(validator)
      );
    }
    middlewares.forEach(name => {
      name = name.replace(',' ,'').trim();
      const handler = this.app.get('middlewares')[name].bind(this.app);
      params.push(
        wrapper(handler)
      );
    });
    params.push(handler);
    this.app[ httpMethod.toLowerCase() ](...params);
  }
}

module.exports = (app) => {
  const routes = new Routes(app);
  routes.init();
};
'use strict';

const fs = require('fs');
const { join } = require('path');

const routes = (app) => {
  const services = app.get('services');
  const config = app.get('config');
  const { wrapper, validate } = services;

  fs.readdirSync(config.routesDir).forEach(dirName => {

    const routeDir = join(config.routesDir, dirName);
    const Class = require(routeDir);
    const validators = require(join(routeDir, 'validators'));
    const instance = new Class({
      db: app.get('db'),
      services,
      config
    });

    /**
     * Iterate through the methods of the class
     */
    Object.getOwnPropertyNames(Class.prototype)
      .filter(m => m != 'constructor')
      .forEach(metaData => {
        const [httpMethod, url, , ...middlewares] = metaData.split(/\s+/);

        let prefix = '';
        if (typeof instance.prefix == 'string') {
          prefix = instance.prefix;
        } else if (!instance.hasOwnProperty('prefix')) {
          prefix = `/${dirName}`;
        }

        /**
         * Assign the handler and define validator middleware
         */
        const [validatorName] = metaData.split(' |');
        const validator = validators[validatorName];
        const handler = wrapper(instance[metaData].bind(instance));

        const params = [prefix + url];
        if (validator instanceof Object) {
          params.push(validate(validator));
        }

        if (middlewares.length > 0) {
          middlewares.forEach(name => {
            name = name.replace(',' ,'').trim();
            const handler = app.get('middlewares')[name].bind(app);
            params.push(wrapper(handler));
          });
        }
        params.push(handler);
        app[ httpMethod.toLowerCase() ](...params);
      });
  });
};

module.exports = routes;
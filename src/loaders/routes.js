'use strict';

const fs = require('fs');
const { join } = require('path');

const routes = (app) => {
  const services = app.get('services');
  const { routesDir } = app.get('config');
  const { wrapper, validate } = services;

  fs.readdirSync(routesDir).forEach(dirName => {

    const routeDir = join(routesDir, dirName);
    const Class = require(routeDir);
    const validators = require(join(routeDir, 'validators'));
    const instance = new Class({
      db: app.get('db'),
      services
    });

    /**
     * Iterate through the methods of the class
     */
    Object.getOwnPropertyNames(Class.prototype)
      .filter(m => m != 'constructor')
      .forEach(metaData => {
        let [httpMethod, url] = metaData.split(' ');

        let prefix = '';
        if (typeof instance.prefix == 'string') {
          prefix = instance.prefix;
        } else if (!instance.hasOwnProperty('prefix')) {
          prefix = `/${dirName}`;
        }

        /**
         * Assign the handler and define validator middleware
         */
        const schema = validators[url.slice(1)];
        const handler = wrapper(instance[metaData].bind(instance));

        const params = [prefix + url];
        if (schema instanceof Object) {
          params.push(validate(schema, httpMethod));
        }
        params.push(handler);
        app[ httpMethod.toLowerCase() ](...params);
      });
  });
};

module.exports = routes;
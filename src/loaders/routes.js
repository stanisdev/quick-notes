'use strict';

const fs = require('fs');
const { join } = require('path');

const routes = (app) => {
  const { routesDir } = app.get('config');
  const { wrapper } = app.get('services');

  fs.readdirSync(routesDir).forEach(dirName => {

    const Class = require(join(routesDir, dirName));
    const instance = new Class({});

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

        url = prefix + url;
        const handler = wrapper(instance[metaData]);
        app[httpMethod.toLowerCase()](url, handler);
      });
  });
};

module.exports = routes;
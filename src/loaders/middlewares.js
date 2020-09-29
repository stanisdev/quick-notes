'use strict';

module.exports = (app) => {
  const { middlewaresDir } = app.get('config');
  app.set('middlewares', require(middlewaresDir));
};
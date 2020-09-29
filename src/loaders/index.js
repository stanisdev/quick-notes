'use strict';

const loaders = async (app) => {
  require('./services')(app);
  await require('./db')(app);
  require('./middlewares')(app);
  require('./routes')(app);
};

module.exports = loaders;
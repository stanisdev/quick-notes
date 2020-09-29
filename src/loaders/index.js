'use strict';

const loaders = (app) => {
  require('./services')(app);
  require('./routes')(app);
};

module.exports = loaders;
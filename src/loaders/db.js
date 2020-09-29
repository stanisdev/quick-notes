'use strict';

const { join } = require('path');

const db = async (app) => {
  const { modelsDir } = app.get('config');
  const db = require(join(modelsDir, 'models'));
  app.set('db', db);
  await db.sequelize.authenticate();
};

module.exports = db;
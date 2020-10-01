'use strict';

require('make-promises-safe');

const EventEmitter = require('events');
const emitter = new EventEmitter();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const config = require('./config');
app.set('config', config);
app.use(bodyParser.json());
app.use(morgan('tiny'));

const start = async () => {
  await require(config.loadersDir)(app);

  app.listen(config.port, () => {
    console.log(`server listening on ${config.port}`);
    emitter.emit('server/started');
  });
};

module.exports = { app, emitter };

start().catch(error => {
  console.error(error);
  process.exit(1);
});
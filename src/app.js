'use strict';

require('make-promises-safe');

const express = require('express');
const app = express();

const config = require('./config');
app.set('config', config);
require(config.loadersDir)(app);

app.listen(config.port, () => {
  console.log(`server listening on ${config.port}`);
});
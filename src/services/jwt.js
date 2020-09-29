'use strict';

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secretKey } = require('../config').jwt;

module.exports = {
  sign(data) {
    return promisify(jwt.sign)(data, secretKey);
  },
  verify(token) {
    return promisify(jwt.verify)(token, secretKey)
  }
};
'use strict';

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { secretKey, expiration } = require('../config').jwt;

module.exports = {
  sign(data) {
    return promisify(jwt.sign)(data, secretKey, { expiresIn: expiration });
  },
  verify(token) {
    return promisify(jwt.verify)(token, secretKey)
  }
};
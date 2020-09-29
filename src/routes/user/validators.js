'use strict';

const validators = {
  login: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        maximum: 5,
        maximum: 20
      },
      password: {
        type: 'string'
      }
    },
    required: ['username', 'password']
  }
};

module.exports = validators;
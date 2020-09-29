'use strict';

const credentials = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      minLength: 3,
      maxLength: 20
    },
    password: {
      type: 'string',
      minLength: 3
    }
  },
  required: ['username', 'password']
};

const validators = {
  login: credentials,
  register: credentials
};

module.exports = validators;
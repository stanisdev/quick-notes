'use strict';

/**
 * Schema of credentials
 */
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

/**
 * Validators of user endpoints
 */
const validators = {
  ['POST /login']: {
    body: credentials
  },
  ['POST /register']: {
    body: credentials
  }
};

module.exports = validators;
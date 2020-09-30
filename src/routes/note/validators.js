'use strict';

const config = require('../../config');

/**
 * Schema of note
 */
const note = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
      minLength: 1,
      maxLength: 1000
    }
  },
  required: ['content']
};

/**
 * Validators of note endpoints
 */
const validators = {
  ['POST /']: {
    body: note
  },
  ['GET /list']: {
    query: {
      type: 'object',
      properties: {
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: config.notes.limit.maximum
        },
        page: {
          type: 'integer',
          minimum: 0
        }
      }
    }
  },
  ['PUT /:id']: {
    body: note,
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          minimum: 1
        }
      }
    }
  }
};

module.exports = validators;

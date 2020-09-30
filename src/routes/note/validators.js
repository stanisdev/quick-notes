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
 * Schema of ID
 */
const id = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 1
    }
  }
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
    params: id
  },
  ['GET /share/:id']: {
    params: id,
    query: {
      type: 'object',
      properties: {
        state: {
          type: 'integer',
          minimum: 0,
          maximum: 1
        }
      }
    }
  },
  ['GET /view/:key']: {
    params: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          maxLength: 9,
          minLength: 9
        }
      }
    }
  }
};

module.exports = validators;

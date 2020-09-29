'use strict';

const Ajv = require('ajv');
const status = require('http-status');

const makeValidator = (schema, httpMethod) => {
  return (req, res, next) => {
    var ajv = new Ajv();

    let data;
    if (httpMethod === 'POST') {
      data = req.body;
    } else {
      data = req.params;
    }
    var valid = ajv.addSchema(schema, 'requestSchema').validate('requestSchema', data);
    if (!valid) {
      const code = status.BAD_REQUEST;
      return res.status(code).send({
        statusCode: code,
        error: status[code],
        message: ajv.errorsText()
      });
    }
    next();
  }
};

module.exports = makeValidator;
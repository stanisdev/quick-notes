'use strict';

const Ajv = require('ajv');
const status = require('http-status');

module.exports = (validator) => (req, res, next) => {
  const keys = Object.keys(validator);
  const code = status.BAD_REQUEST;

  /**
   * We can define simultaneously several schema-validators for one endpoint
   * (example: for "params" and "query")
   */
  for (let a = 0; a < keys.length; a++) {
    const dataSource = keys[a];
    const data = req[dataSource];
    const schema = validator[dataSource];

    const ajv = new Ajv({ coerceTypes: true });
    const isValid = ajv.addSchema(schema, 'requestSchema').validate('requestSchema', data);

    if (!isValid) {
      return res
        .status(code)
        .send({
          statusCode: code,
          error: status[code],
          message: ajv.errorsText()
        });
    }
  }
  next();
};
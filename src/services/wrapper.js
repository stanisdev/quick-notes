'use strict';

const status = require('http-status');
const env = process.env.NODE_ENV;

module.exports = (fn) => {
  /**
   * This wrapper allows to treat the code inside an express route as asynchronous.
   */
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        if (env !== 'test') {
          console.error(error); // @todo: replace by another logger
        }

        /**
         * This is an error handler which determines what kind
         * of error was thrown
         */
        if (!(error instanceof Error)) {
          error = new Error(status[500]);
        }
        let message = env === 'production' ? status[500] : error.message;
        let code = status.INTERNAL_SERVER_ERROR;

        if (error.isBoom) {
          const { payload } = error.output;
          message = payload.message;
          code = payload.statusCode;
        }
        const result = {
          statusCode: code,
          error: status[code],
          message
        };
        res.status(code).send(result);
      });
  }
};
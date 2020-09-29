'use strict';

const { strictEqual } = require('assert').strict;

const middlewares = {
  async auth(req, res, next) {
    const data = req.headers.authorization;
    const services = this.get('services');

    let decoded
    try {
      strictEqual(typeof data == 'string', true);

      const [, token] = data.split(' ');
      decoded = await services.jwt.verify(token);
      const user = await this.get('db').User.findByPk(decoded.id);

      strictEqual(user instanceof Object, true);
      req.user = user;
    } catch {
      throw services.boom.unauthorized('Wrong token');
    }
    next();
  }
};

module.exports = middlewares;

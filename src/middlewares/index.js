'use strict';

const { strictEqual } = require('assert').strict;

const middlewares = {
  /**
   * Get jwt, decode it and check user existence
   */
  async auth(req, res, next) {
    const data = req.headers.authorization;
    const services = this.get('services');

    try {
      strictEqual(typeof data == 'string', true);

      const [, token] = data.split(' ');
      const decoded = await services.jwt.verify(token);
      const user = await this.get('db').User.findByPk(decoded.id);

      strictEqual(user instanceof Object, true);
      req.user = user;
    } catch {
      throw services.boom.unauthorized('Wrong token');
    }
    next();
  },
  /**
   * Find note by id taken from the "params"
   */
  async findNote(req, res, next) {
    const [note] = await req.user.getNotes({
      where: {
        id: req.params.id
      }
    });
    if (!(note instanceof Object)) {
      throw this.get('services').boom.badRequest('Note not found');
    }
    req.note = note;
    next();
  }
};

module.exports = middlewares;

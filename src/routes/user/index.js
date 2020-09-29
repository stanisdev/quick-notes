'use strict';

class User {
  constructor({ db }) {
    this.db = db;
    this.prefix = '/user';
  }

  /**
   * Login by username/password
   */
  async ['POST /login'](req) {
    return { ok: true };
  }
}

module.exports = User;
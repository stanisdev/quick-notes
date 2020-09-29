'use strict';

class User {
  constructor({ db, services }) {
    this.db = db;
    this.services = services;
    this.prefix = '/user';
  }

  /**
   * Login by username/password
   */
  async ['POST /login']({ body }) {
    const { username, password } = body;

    const user = await this.db.User.findByUsername(username);
    if (!(user instanceof Object) || !await user.checkPassword(password)) {
      throw this.services.boom.badRequest('Wrong login/password');
    }
    const token = await this.services.jwt.sign({ id: user.id });
    return { token };
  }

  /**
   * Registration of the new user
   */
  async ['POST /register']({ body }) {
    const user = await this.db.User.findByUsername(body.username);
    if (user instanceof Object) {
      throw this.services.boom.conflict('Pick up another username as the entered one already exists');
    }
    await this.db.User.createNew(body);
    return { ok: true };
  }
}

module.exports = User;
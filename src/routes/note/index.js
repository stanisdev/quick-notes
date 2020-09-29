'use strict';

class Notes {
  constructor({ db }) {
    this.db = db;
    this.prefix = '/note';
  }

  /**
   * Get list of notes
   */
  async ['GET /list | auth'](req) {
    return { ok: true }
  }
}

module.exports = Notes;
'use strict';

class Notes {
  constructor({ db, config }) {
    this.db = db;
    this.config = config;
    this.prefix = '/note';
  }

  /**
   * Create new note
   */
  async ['POST / | auth']({ body, user }, res) {
    await this.db.Note.create({
      content: body.content,
      userId: user.id
    });
    res.send({ ok: true });
  }

  /**
   * Get list of notes
   */
  async ['GET /list | auth']({ user, query }, res) {
    const { limit, offset } = this.#composeLimitOffset(query);
    const params = {
      limit,
      offset,
      userId: user.id
    }
    const notes = await this.db.Note.getMany(params);
    res.send({ notes });
  }

  /**
   * Edit a note
   */
  async ['PUT /:id | auth, findNote']({ note, body }, res) {
    await note.set('content', body.content).save();
    res.send({ ok: true });
  }

  /**
   * Remove a note
   */
  async ['DELETE /:id | auth, findNote']({ note }, res) {
    await note.destroy();
    res.send({ ok: true });
  }

  /**
   * Get prepared limit/offset pair for getting list of notes
   */
  #composeLimitOffset({ limit = this.config.notes.limit.default, page = 0 }) {
    limit = +limit;
    const offset = limit * +page;
    return { limit, offset };
  }
}

module.exports = Notes;

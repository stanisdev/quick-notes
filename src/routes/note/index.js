'use strict';

const { nanoid } = require('nanoid/async');

class Notes {
  constructor({ db, config, services }) {
    this.db = db;
    this.config = config;
    this.services = services;
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
    res.send(notes);
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
   * Change publicity of a note
   */
  async ['GET /share/:id | auth, findNote']({ note, query }, res) {
    let state = 1, key;
    if (Number.isInteger(query.state)) {
      state = query.state;
    }
    if (state === 1) {
      key = await nanoid(9);
    } else {
      key = null;
    }    
    await note.set('publicKey', key).save();
    res.send({ ok: true });
  }

  /**
   * View note by public key
   */
  async ['GET /view/:key']({ params }, res) {
    const note = await this.db.Note.getForPublicView(params.key);
    if (!(note instanceof Object)) {
      throw this.services.boom.badRequest('Note not found');
    }
    res.send(note);
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

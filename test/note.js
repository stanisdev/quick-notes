'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, emitter } = require('../src/app');
const expect = chai.expect;
const db = app.get('db');
let token;

let tooLongContent = '';
for (let a = 0; a < 1001; a++) {
  tooLongContent += 'a';
}

chai.should();
chai.use(chaiHttp);

describe('Note', () => {
  before((done) => {
    emitter.on('server/started', async () => {
      const credentials = {
        username: 'f32',
        password: '1234bm'
      };
      const { body } = await chai.request(app)
        .post('/user/login')
        .send(credentials);

      token = 'Bearer ' + body.token;
      done();
    });
  });

  describe('GET /list', () => {
    it('respond with list of the notes', async () => {
      const res = await chai.request(app)
        .get('/note/list')
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.should.have.length(3);

      const [note] = res.body;
      expect(note).to.be.a('object');
      expect(note).to.have.property('id').with.eq(1);
      expect(note).to.have.property('content').with.eq('1-th private note');
    });

    it('respond with list of the notes using paginate', async () => {
      const res = await chai.request(app)
        .get('/note/list')
        .query({ limit: 2, page: 1 })
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.should.have.length(1);

      const [note] = res.body;
      expect(note).to.be.a('object');
      expect(note).to.have.property('id').with.eq(3);
      expect(note).to.have.property('content').with.eq('3-d private note');
    });
  });

  describe('POST /', () => {
    it('create new note', async () => {
      const data = { content: 'Note content' };
      const condition = {
        where: {
          userId: 1,
          content: data.content
        }
      };
      await db.Note.destroy(condition);

      const res = await chai.request(app)
        .post('/note')
        .set('Authorization', token)
        .send(data)

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);

      const note = await db.Note.findOne(condition);
      expect(note).to.be.a('object');
      expect(note).to.have.property('content').with.eq(data.content);
    });

    it('restrict to create the note with content more than 1000 symbols', async () => {
      const res = await chai.request(app)
        .post('/note')
        .set('Authorization', token)
        .send({ content: tooLongContent });

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });

  describe('PUT /:id', () => {
    it('edit new note', async () => {
      const data = { content: 'New content' };
      const res = await chai.request(app)
        .put('/note/1')
        .set('Authorization', token)
        .send(data)

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);

      const note = await db.Note.findByPk(1);
      expect(note).to.be.a('object');
      expect(note).to.have.property('content').with.eq(data.content);
    });

    it('restrict to edit the note with content more than 1000 symbols', async () => {
      const res = await chai.request(app)
        .put('/note/1')
        .set('Authorization', token)
        .send({ content: tooLongContent });

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });

    it('restrict to edit the note which belongs to another user', async () => {
      const res = await chai.request(app)
        .put('/note/5')
        .set('Authorization', token)
        .send({ content: 'New content' });

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });

  describe('DELETE /:id', () => {
    it('remove the note', async () => {
      const res = await chai.request(app)
        .delete('/note/2')
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);

      const note = await db.Note.findByPk(2);
      expect(note).to.be.a('null');
    });

    it('restrict to remove the note which belongs to another user', async () => {
      const res = await chai.request(app)
        .delete('/note/5')
        .set('Authorization', token);

        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
    });
  });

  describe('/GET /share/:id', () => {
    it('set the note as public', async () => {
      const res = await chai.request(app)
        .get('/note/share/1')
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);

      const note = await db.Note.findByPk(1);
      expect(note).to.be.a('object');
      expect(note).to.have.property('publicKey').with.length(9);
    });

    it('set the note as private', async () => {
      const res = await chai.request(app)
        .get('/note/share/1')
        .query({ state: 0 })
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);

      const note = await db.Note.findByPk(1);
      expect(note).to.be.a('object');
      expect(note).to.have.property('publicKey').eq(null);
    });

    it('restrict to change publicity of the note which belongs to another user', async () => {
      const res = await chai.request(app)
        .get('/note/share/5')
        .set('Authorization', token);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });

  describe('GET /view/:key', () => {
    it('view the note by public key', async () => {
      const res = await chai.request(app)
        .get('/note/view/UUowyvbuK')
        .set('Authorization', token);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.content.should.be.eql('Public note (user 2)');
    });

    it('get an error if user try to view non existing note', async () => {
      const res = await chai.request(app)
        .get('/note/view/LLLLLLLLL')
        .set('Authorization', token);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
});
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../src/app');
const db = app.get('db');
let token;

chai.should();
chai.use(chaiHttp);

describe('User', () => {
  describe('POST /login', () => {
    it('respond with token', async () => {
      const credentials = {
        username: 'f32',
        password: '1234bm'
      };
      const res = await chai.request(app)
        .post('/user/login')
        .send(credentials);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
      res.body.token.should.be.a('string');

      token = res.body.token;
    });

    it('restrict to login with wrong username', async () => {
      const credentials = {
        username: 'f30',
        password: '1234bm'
      };
      const res = await chai.request(app)
        .post('/user/login')
        .send(credentials);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });

    it('restrict to login with wrong password', async () => {
      const credentials = {
        username: 'f32',
        password: '1****'
      };
      const res = await chai.request(app)
        .post('/user/login')
        .send(credentials);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });

    it('check correctness of the token', async () => {
      const res = await chai.request(app)
        .get('/note/list')
        .set('Authorization', 'Bearer ' + token)

      res.should.have.status(200);
      res.body.should.be.a('array');
    });
  });

  describe('POST /register', () => {
    const credentials = {
      username: 'a50',
      password: '1234bm'
    };

    it('register user', async () => {
      await db.User.destroy({
        where: {
          username: credentials.username
        }
      });
      const res = await chai.request(app)
        .post('/user/register')
        .send(credentials);

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.ok.should.be.equal(true);
    });

    it('login the registered user', async () => {
      const res = await chai.request(app)
        .post('/user/login')
        .send(credentials);

      res.should.have.status(200);
      res.body.should.be.a('object');
    });

    it('restrict to register with username absence', async () => {
      const credentials = {
        password: '1234bm'
      }
      const res = await chai.request(app)
        .post('/user/register')
        .send(credentials);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });

    it('restrict to register with password absence', async () => {
      const credentials = {
        username: 'g70'
      }
      const res = await chai.request(app)
        .post('/user/register')
        .send(credentials);

      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });

    it('restrict to register if username already exists in DB', async () => {
      const credentials = {
        username: 'f32',
        password: '*****'
      }
      const res = await chai.request(app)
        .post('/user/register')
        .send(credentials);

      res.should.have.status(409);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
});
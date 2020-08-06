const app = require('../../app');
const request = require('supertest');
const should = require('should');
const db = require('../../models');
const { users, goals } = require('../dummy');

describe('GET /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  before(() => db.User.bulkCreate(goals));
  describe('성공시', () => {
    it('일일 목표 일정을 모두 가져온다', done => {
      request(app)
        .get('/goals/1/dilygoal')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });
});

describe('POST /', () => {
  describe('성공시', () => {
    it('데일리 목표가 등록된다.', done => {});
  });
});

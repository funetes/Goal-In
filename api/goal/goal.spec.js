const app = require('../../app');
const request = require('supertest');
const should = require('should');
const db = require('../../models');
const { users, goals } = require('../dummy');

describe('GET /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  before(() => db.Goal.bulkCreate(goals));
  describe('성공시', () => {
    it('기본 최근 10개를 배열로 응답한다.', done => {
      request(app)
        .get('/goals')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          res.body.should.have.lengthOf(10);
          done();
        });
    });
  });
});

describe('POST /', () => {
  describe('성공시', () => {
    before(() => db.sequelize.sync({ force: true }));
    before(() => db.User.bulkCreate(users));
    it('해당 객체를 응답한다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020/07/29-2020/08/03',
          completed: false,
          isExpire: false,
        })
        .end((err, res) => {
          res.body.should.have.property('title', 'testTitle');
          done();
        });
    });
    it('여러번 등록이 가능하다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle2',
          term: '2020/07/30-2020/08/03',
          completed: false,
          isExpire: false,
        })
        .end((err, res) => {
          res.body.should.have.property('title', 'testTitle2');
          done();
        });
    });
  });
  describe('실패시', () => {
    it('필수 data가 오지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020/07/29-2020/08/03',
          UserId: '1',
        })
        .expect(400)
        .end(done);
    });
    it('날짜가 유효하지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020/07/29-2020/EF/03',
          completed: false,
          isExpire: false,
          UserId: '1',
        })
        .expect(400)
        .end((err, res) => {
          res.text.should.equal('term validate error');
          done();
        });
    });
  });
});

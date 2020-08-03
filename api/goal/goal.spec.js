const app = require('../../app');
const request = require('supertest');
const should = require('should');
const db = require('../../models');
const { users, goals } = require('../dummy');
const { describe } = require('mocha');

describe('GET /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  before(() => db.Goal.bulkCreate(goals));
  describe('성공시', () => {
    it('기본 최근 10개를 배열로 응답한다.', done => {
      request(app)
        .get('/goals')
        .end((err, res) => {
          res.body.rows.should.be.instanceOf(Array);
          res.body.rows.should.have.lengthOf(10);
          done();
        });
    });
    //query로 넘어온 값으로 pagination, 10개씩 보여주기
    it('페이지네이션이 가능하다.', done => {
      request(app)
        .get('/goals?page=2')
        .end((err, res) => {
          res.body.rows.should.have.lengthOf(1);
          done();
        });
    });
  });
});

describe('GET /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  before(() => db.Goal.bulkCreate(goals));
  describe('성공시', () => {
    it('해당 객체를 응답한다.', done => {
      request(app)
        .get('/goals/5')
        .end((err, res) => {
          res.body.should.have.property('id', 5);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('숫자형이 아닌 id로 보내면 400을 응답한다.', done => {
      request(app).get('/goals/foo').expect(400).end(done);
    });
    it('없는 id로 요청하면 404를 응답한다', done => {
      request(app).get('/goals/4000').expect(404).end(done);
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
    it('날짜가 형식이 유효하지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020/07/29-2020/14/03',
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
    it('날짜의 기간이 맞지 않으면 400을 응답한다', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020/10/29-2019/01/03',
          completed: false,
          isExpire: false,
          UserId: '1',
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('PUT /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  before(() => db.Goal.bulkCreate(goals));
  describe('성공시', () => {
    it('변경된 객체를 응답한다', done => {
      request(app)
        .put('/goals/5')
        .send({
          title: 'changeTitle',
        })
        .end((err, res) => {
          const result = res.body[0];
          res.body.should.have.be.instanceOf(Array);
          result.should.equal(1);
          done();
        });
    });
    it('유효한 날짜를 변경해야함', done => {
      request(app)
        .put('/goals/2')
        .send({
          term: '2020/08/01-2020/08/02',
        })
        .end((err, res) => {
          const result = res.body[0];
          res.body.should.have.be.instanceOf(Array);
          result.should.equal(1);
          done();
        });
    });
  });
});

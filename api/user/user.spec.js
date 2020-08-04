const app = require('../../app');
const request = require('supertest');
const should = require('should');
const db = require('../../models');
const { users, items } = require('../dummy');
describe('GET /', () => {
  describe('성공시', () => {
    before(() => db.sequelize.sync({ force: true }));
    before(() => db.User.bulkCreate(users));
    it('유저 배열을 리턴한다.', done => {
      request(app)
        .get('/users')
        .end((err, data) => {
          if (err) {
            console.log(err);
          }
          data.body.should.be.instanceOf(Array);
          done();
        });
    });
    it('최대 limit갯수만큼의 배열을 리턴한다.', done => {
      request(app)
        .get('/users?limit=2')
        .end((err, data) => {
          if (err) {
            console.log(err);
          }
          data.body.should.have.lengthOf(2);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('limit이 숫자형이 아니면 400을 반환한다.', done => {
      request(app).get('/users?limit=one').expect(400).end(done);
    });
  });
});

describe('GET /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('id가 1인 user객체를 반환한다.', done => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다.', done => {
      request(app).get('/users/foo').expect(400).end(done);
    });
    it('없는 id로 요청하면 404를 응답한다.', done => {
      request(app).get('/users/80').expect(404).end(done);
    });
  });
});

describe('DELETE /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('204를 응답한다.', done => {
      request(app).delete('/users/1').expect(204).end(done);
    });
  });
  describe('실패시', () => {
    it('숫자가 아닐경우 400로 응답한다.', done => {
      request(app).delete('/users/one').expect(400).end(done);
    });
  });
});

describe('POST /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    let response;
    before(done => {
      request(app)
        .post('/users')
        .send({
          userName: 'lee',
          email: 'leelove2324@gmail.com',
          passWord: 'oop123456',
        })
        .expect(201)
        .end((err, res) => {
          response = res.body;
          done();
        });
    });
    it('생성된 user객체를 반환한다.', () => {
      response.should.have.property('id');
    });
    it('입력한 name을 반환한다.', () => {
      response.should.have.property('userName', 'lee');
    });
  });
  describe('실패시', () => {
    it('userName,email이 오지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/users')
        .send({ userName: 'park' })
        .expect(400)
        .end(done);
    });
    it('userName,email이 중복되면 409를 응답한다.', done => {
      request(app)
        .post('/users')
        .send({
          userName: 'kim',
          email: 'park2324@gmail.com',
          passWord: 'oop123456',
        })
        .expect(409)
        .end(done);
    });
  });
});

describe.only('POST /item/:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('200을 응답한다.', done => {
      request(app)
        .post('/users/1/item/1')
        .send({
          Price: 100,
        })
        .expect(200)
        .end(done);
    });
  });
});

describe('PUT /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('변경된 정보를 응답한다.', done => {
      const userName = 'kang';
      request(app)
        .put('/users/2')
        .send({ userName })
        .end((err, res) => {
          res.body.should.have.property('userName', userName);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('정수가 아닌 id일 경우 400으로 응답한다.', done => {
      request(app)
        .put('/users/:two')
        .send({ userName: 'la' })
        .expect(400)
        .end(done);
    });
    it('userName이 없을경우 400으로 응답한다.', done => {
      request(app).put('/users/2').send({}).expect(400).end(done);
    });
    it('없는 유저일 경우 404로 응답한다.', done => {
      request(app)
        .put('/users/100')
        .send({ userName: 'choi' })
        .expect(404)
        .end(done);
    });
    it('이름이 중복일 경우 409로 응답한다.', done => {
      request(app)
        .put('/users/1')
        .send({ userName: 'kang' })
        .expect(409)
        .end(done);
    });
  });
});

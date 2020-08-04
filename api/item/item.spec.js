const should = require('should');
const request = require('supertest');
const app = require('../../app');
const db = require('../../models');
const { items } = require('../dummy');
const { describe } = require('mocha');

describe('GET /', () => {
  describe('성공시', () => {
    before(() => db.sequelize.sync({ force: true }));
    before(() => db.Item.bulkCreate(items));
    it('items 배열을 반환한다.', done => {
      request(app)
        .get('/items')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('요청실패시 500을 응답한다.', done => {
      request(app).get('/items').expect(500);
      done();
    });
  });
});

describe('GET /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  describe('성공시', () => {
    it('해당 id의 아이템을 가져온다.', done => {
      request(app)
        .get('/items/1')
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          res.body.should.have.property('itemName', 'backgroundA');
          done();
        });
    });
  });
  describe('실패시', () => {
    it('숫자가 아니면 400을 응답한다.', done => {
      request(app).get('/items/poo').expect(400).end(done);
    });
    it('해당 id에 item이 없으면 204를 응답한다.', done => {
      request(app).get('/items/1000').expect(204).end(done);
    });
  });
});

describe('POST /', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  describe('성공시', () => {
    it('아이템 등록 성공시 해당 아이템 객체를 리턴한다.', done => {
      request(app)
        .post('/items')
        .send({
          itemName: 'backgroundB',
          categori: 'background',
          image: 'null',
          price: 1300,
          description: 'something beautiful background',
        })
        .end((err, res) => {
          res.body.should.have.property('id', 4);
          res.body.should.have.property('itemName', 'backgroundB');
          res.body.should.have.property('price', 1300);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('아이템 이름이 중복이면 409 응답한다.', done => {
      request(app)
        .post('/items')
        .send({
          itemName: 'backgroundA',
          categori: 'background',
          image: 'null',
          price: 1300,
          description: 'something beautiful background',
        })
        .expect(409)
        .end(done);
    });
    it('카테고리가 올바르지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/items')
        .send({
          itemName: 'backgroundC',
          categori: 'back',
          image: 'null',
          price: 1300,
          description: 'something beautiful background',
        })
        .end(done);
    });
    it('필수로 들어야가야할 값이 빠지면 400응답한다.', done => {
      request(app)
        .post('/items')
        .send({
          itemName: 'backgroundF',
          categori: 'back',
          description: 'something beautiful background',
        })
        .expect(400)
        .end(done);
    });
  });
});

describe('PUT /:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  describe('성공시', () => {
    it('변경된 아이템의 객체를 응답한다.', done => {
      request(app)
        .put('/items/1')
        .send({
          itemName: 'A',
          categori: 'etc',
        })
        .end((err, res) => {
          res.body.should.have.property('itemName', 'A');
          res.body.should.have.property('categori', 'etc');
          done();
        });
    });
  });
  describe('실패시', () => {
    it('변경하려는 이름이 중복일때 409을 응답한다.', done => {
      request(app)
        .put('/items/2')
        .send({
          itemName: 'A',
        })
        .expect(409)
        .end(done);
    });
    it('카테고리가 잘못되었을떄 400을 응답한다.', done => {
      request(app)
        .put('/items/3')
        .send({
          itemName: 'something super cool name',
          categori: 'null',
        })
        .expect(400)
        .end(done);
    });
  });
});

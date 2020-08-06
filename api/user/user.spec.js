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

describe('POST /item/:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('200을 응답한다.', done => {
      request(app).post('/users/1/item/1').expect(200).end(done);
    });
  });
  describe('실패시', () => {
    it('parameter가 숫자가 아니면 400을 응답한다', done => {
      request(app).post('/users/foo/item/pow').expect(400).end(done);
    });
    it('존재하지 않는 userId, itemId를 요청하면 404를 응답한다.', done => {
      request(app).post('/users/4000/item/1900').expect(404).end(done);
    });
    it('크레딧이 부족하면 구매하지 못한다. 400응답', done => {
      request(app)
        .post('/users/2/item/1')
        .expect(400)
        .end((err, res) => {
          res.text.should.equal('not enough money');
          done();
        });
    });
    it('이미 구매한 아이템은 재구매 하지 못한다. 400응답', done => {
      request(app)
        .post('/users/1/item/1')
        .expect(400)
        .end((err, res) => {
          res.text.should.equal('already purchase');
          done();
        });
    });
  });
});

describe.only('POST /myitem/:id', () => {
  before(() => db.sequelize.sync({ force: true }));
  before(() => db.Item.bulkCreate(items));
  before(() => db.User.bulkCreate(users));
  describe('성공시', () => {
    it('해당 아이템이 적용된다.', done => {
      const userp = db.User.findOne({
        where: {
          id: 1,
        },
      });
      const itemp = db.Item.findOne({
        where: {
          id: 1,
        },
      });
      Promise.all([userp, itemp])
        .then(([user, item]) => {
          return user.addItem(item);
        })
        .then(_ => {
          request(app)
            .post('/users/myitem/1')
            .end((err, res) => {
              // 내가 가지고 있는 아이템의 isApplied 가 true가 된다.
              res.body.should.have.property('ItemId', 1);
              res.body.should.have.property('UserId', 1);
              res.body.should.have.property('isApplied', true);
              done();
            });
        });
    });
    it('한번더 요청하면 적용이 해제된다.', done => {
      request(app)
        .post('/users/myitem/1')
        .end((err, res) => {
          res.body.should.have.property('ItemId', 1);
          res.body.should.have.property('UserId', 1);
          res.body.should.have.property('isApplied', false);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('내가 가지고 있지 않는 아이템을 적용할수 없다', done => {
      request(app)
        .post('/users/myitem/5')
        .expect(400)
        .end((err, res) => {
          res.text.should.equal('wrong access');
          done();
        });
    });
    it('itemId,userId는 숫자로 오지 않으면 400을 응답한다.', done => {
      request(app)
        .post('/users/myitem/bar')
        .expect(400)
        .end((err, res) => {
          res.text.should.equal('userid or itemid is not int');
          done();
        });
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

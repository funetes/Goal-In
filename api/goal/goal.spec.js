const app = require('../../app');
const request = require('supertest');
const should = require('should');
const db = require('../../models');

describe('POST /', () => {
  describe('성공시', () => {
    before(() => db.sequelize.sync({ force: true }));
    before(() =>
      db.User.bulkCreate([
        {
          userName: 'kim',
          email: 'kimlove2324@gmail.com',
          passWord: 'kk23i203',
          avatar: null,
          motto: null,
        },
      ])
    );
    it('해당 객체를 응답한다.', done => {
      request(app)
        .post('/goals')
        .send({
          title: 'testTitle',
          term: '2020.07.29-2020.08.03',
          completed: false,
          isExpire: false,
          UserId: '1',
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
          title: 'testTitle',
          term: '2020.07.29-2020.08.03',
          completed: false,
          isExpire: false,
          UserId: '1',
        })
        .end((err, res) => {
          res.body.should.have.property('title', 'testTitle');
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
          term: '2020.07.29-2020.08.03',
          UserId: '1',
        })
        .expect(400)
        .end(done);
    });
  });
});

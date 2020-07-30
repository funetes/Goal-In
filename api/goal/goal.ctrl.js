const { Goal } = require('../../models');
const index = async (req, res) => {
  const userId = req.body.userId;
  // get goals default index is 10
  // 최근 10개  기본
  // offset을 주어서 pagination을 구현해야함.

  const goals = await Goal.findAll({});
};
const show = () => {
  // show goals with query
};
const create = async (req, res) => {
  // create goals
  // userId는 유저 인증후 미들웨어에서 올것임
  const { title, term, completed, isExpire, UserId } = req.body;
  // 모든 값이 있는지 체크해야 한다. 하지만 boolean값이 있다. how?

  // userId는 유저 인증후 미들웨어에서 올것임
  const userId = parseInt(UserId, 10);
  try {
    const goal = await Goal.create({
      title,
      term,
      completed,
      isExpire,
      UserId: userId,
    });
    res.json(goal);
    return goal;
  } catch (error) {
    console.log(error);
  }
};

const update = () => {
  // update goals
};
const destroy = () => {
  // delete goals
};

module.exports = {
  // index,
  // show,
  create,
  // update,
  // destroy,
};

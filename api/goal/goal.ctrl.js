const { Goal, User } = require('../../models');
const index = async (req, res) => {
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  // offset을 주어서 pagination을 구현해야함.
  try {
    const goals = await Goal.findAll({
      where: {
        Userid: userId,
      },
      // 최근 10개
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    res.json(goals);
  } catch (error) {
    return res.status(500).end();
  }
};
const show = () => {
  // show goals with query
};
const create = async (req, res) => {
  // create goals
  // userId는 유저 인증후 미들웨어에서 올것임
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  const { title, term, completed, isExpire } = req.body;

  if (
    title === undefined ||
    term === undefined ||
    completed === undefined ||
    isExpire === undefined ||
    userId === undefined
  ) {
    return res.status(400).end();
  }
  // userId는 유저 인증후 미들웨어에서 올것임
  try {
    const goal = await Goal.create({
      title,
      term,
      completed,
      isExpire,
      UserId: userId,
    });
    res.json(goal);
  } catch (error) {
    if (error.errors[0].message === 'term validate error') {
      return res.status(400).end('term validate error');
    }
    return res.status(500).end();
  }
};

const update = () => {
  // update goals
};
const destroy = () => {
  // delete goals
};

module.exports = {
  index,
  // show,
  create,
  // update,
  // destroy,
};

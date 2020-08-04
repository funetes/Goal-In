const { Goal } = require('../../models');
const { checkNullAndUndefined } = require('../../utils/checkNullAndUndefined');

const index = async (req, res) => {
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  const { page = 1 } = req.query;
  let size = 10;
  let limit = size;
  try {
    const goals = await Goal.findAndCountAll({
      where: {
        Userid: userId,
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * size,
    });
    res.json(goals);
  } catch (error) {
    return res.status(500).end();
  }
};
const show = async (req, res) => {
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  const goalId = parseInt(req.params.id);
  if (isNaN(goalId)) return res.status(400).end();

  try {
    const goal = await Goal.findOne({
      where: {
        UserId: userId,
        id: goalId,
      },
    });
    if (!goal) return res.status(404).end();
    res.json(goal);
  } catch (error) {
    return res.status(500).end();
  }
};
const create = async (req, res) => {
  // create goals
  // userId는 유저 인증후 미들웨어에서 올것임
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임

  const { title, term, completed, isExpire } = req.body;
  const goal = {
    title,
    term,
    completed,
    isExpire,
    UserId: userId,
  };
  if (!checkNullAndUndefined(goal)) {
    return res.status(400).end();
  }
  try {
    const newGoal = await Goal.create(goal);
    res.json(newGoal);
  } catch (error) {
    if (error.errors[0].message === 'term validate error') {
      return res.status(400).end('term validate error');
    }
    return res.status(500).end();
  }
};
const update = async (req, res) => {
  // update goals
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  const goalId = parseInt(req.params.id);
  if (isNaN(goalId)) return res.status(400).end();

  const { title, term } = req.body;
  const set = {};
  title ? (set.title = title) : null;
  term ? (set.term = term) : null;

  try {
    const goal = await Goal.update(set, {
      where: {
        UserId: userId,
        id: goalId,
      },
    });
    if (goal[0] !== 1) {
      return res.status(400).end();
    }
    res.json(goal);
  } catch (error) {
    if (error.errors[0].message === 'term validate error') {
      return res.status(400).end('term validate error');
    }
    return res.status(500).end();
  }
};
const destroy = async (req, res) => {
  // delete goals
  const userId = parseInt('1', 10); //userId는 유저 인증후 미들웨어에서 올것임
  const goalId = parseInt(req.params.id);

  try {
    await Goal.destroy({
      where: {
        id: goalId,
        UserId: userId,
      },
    });
    res.status(204).end();
  } catch (error) {
    return res.status(500).end();
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};

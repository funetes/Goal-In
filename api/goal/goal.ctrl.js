const { Goal } = require('../../models');
// const { validateTerm } = require('../../utils/validate');
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

  if (
    title === undefined ||
    term === undefined ||
    completed === undefined ||
    isExpire === undefined ||
    userId === undefined
  ) {
    return res.status(400).end();
  }
  try {
    const newGoal = await Goal.create({
      title,
      term,
      completed,
      isExpire,
      UserId: userId,
    });
    // if (!created) return res.status(500).end();
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
  const { title } = req.body;
  try {
    const goal = await Goal.findOne({
      where: {
        UserId: userId,
        id: goalId,
      },
    });
    if (title) goal.title = title;
    await goal.save();
    res.json(goal);
  } catch (error) {
    console.log(error);
  }
};
const destroy = () => {
  // delete goals
};

module.exports = {
  index,
  show,
  create,
  update,
  // destroy,
};

const { User, Item } = require('../../models');
const { checkNullAndUndefined } = require('../../utils/checkNullAndUndefined');

const index = async (req, res) => {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit);
  if (isNaN(limit)) {
    return res.status(400).end();
  }
  const users = await User.findAll({
    limit,
  });
  res.json(users);
};

const show = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).end();
  }
  const user = await User.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    return res.status(404).end();
  }
  return res.json(user);
};

const destroy = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).end();
  try {
    await User.destroy({ where: { id } });
    res.status(204).end();
  } catch (error) {
    return res.status(500).end();
  }
};

const create = async (req, res) => {
  const { userName, email, passWord } = req.body;
  if (!userName || !email) return res.status(400).end();
  try {
    const [user, created] = await User.findOrCreate({
      where: {
        userName,
        email,
      },
      defaults: {
        passWord,
        avatar: null,
        motto: null,
        credit: 0,
      },
    });
    if (!created) {
      return res.status(500).end();
    }
    res
      .status(201)
      .json({ id: user.id, userName: user.userName, email: user.email });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).end();
    }
  }
};

const purchaseItem = async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const itemId = parseInt(req.params.itemId, 10);
  const ids = {
    userId,
    itemId,
  };
  // null check
  if (isNaN(userId) || isNaN(itemId) || !checkNullAndUndefined(ids)) {
    return res.status(400).end();
  }

  try {
    const userP = User.findOne({
      where: {
        id: userId,
      },
    });
    // item 1번 검색
    const itemP = Item.findOne({
      where: {
        id: itemId,
      },
    });
    const [user, item] = await Promise.all([userP, itemP]);
    if (user.credit < item.price) {
      return res.status(400).end();
    }
    // 트랜젝션?
    user.credit -= item.price;
    await user.addItem(item);
    await user.save();
    res.status(200).end();
  } catch (error) {}
};

const update = async (req, res) => {
  const id = parseInt(req.params.id);
  const { userName, motto } = req.body;
  if (isNaN(id) || !userName) return res.status(400).end();
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) return res.status(404).end();
    userName ? (user.userName = userName) : null;
    motto ? (user.motto = motto) : null;

    await user.save();
    res.json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).end();
    }
  }
};

module.exports = {
  index,
  show,
  destroy,
  create,
  update,
  purchaseItem,
};

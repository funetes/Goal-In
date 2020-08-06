const { User, Item, UserItem } = require('../../models');
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

  try {
    if (isNaN(userId || itemId)) throw new Error('weird parameter!');
    if (!checkNullAndUndefined(ids)) throw new Error('null or undefined!');

    const userP = User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Item,
          through: {
            where: {
              UserId: userId,
              ItemId: itemId,
            },
          },
        },
      ],
      row: true,
    });
    const itemP = Item.findOne({
      where: {
        id: itemId,
      },
    });
    const [user, item] = await Promise.all([userP, itemP]);

    if (!user || !item) throw new Error('no user or no item');

    if (user.Items.length !== 0) throw new Error('already purchase');

    if (user.credit < item.price) throw new Error('not enough money');

    user.credit -= item.price;
    await user.addItem(item);
    await user.save();

    res.status(200).end();
  } catch (error) {
    switch (error.message) {
      case 'null or undefined!':
      case 'weird parameter!':
      case 'not enough money':
      case 'already purchase':
        return res.status(400).end(error.message);
      case 'no user or no item':
        return res.status(404).end();
      default:
        return res.status(500).end();
    }
  }
};

const applyItem = async (req, res) => {
  const userId = parseInt('1', 10); // userId는 인증후 미들웨어에서 옴.
  const itemId = parseInt(req.params.id, 10);
  try {
    if (isNaN(userId) || isNaN(itemId))
      throw new Error('userid or itemid is not number');

    const myItem = await UserItem.findOne({
      where: {
        UserId: userId,
        ItemId: itemId,
      },
    });
    if (!myItem) throw new Error('wrong access');
    myItem.isApplied = !myItem.isApplied;
    await myItem.save();
    res.json(myItem);
  } catch (error) {
    switch (error.message) {
      case 'wrong access':
      case 'userid or itemid is not int':
        return res.status(400).end(error.message);
      default:
        return res.status(500).end();
    }
  }
};

const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { userName, motto } = req.body;
  try {
    if (isNaN(id)) throw new Error('weird id!');
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new Error('no user');
    userName ? (user.userName = userName) : null;
    motto ? (user.motto = motto) : null;

    await user.save();
    res.json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).end();
    }
    switch (error.message) {
      case 'weird id!':
        return res.status(400).end();
      case 'no user':
        return res.status(404).end();
      default:
        return res.status(500).end();
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
  applyItem,
};

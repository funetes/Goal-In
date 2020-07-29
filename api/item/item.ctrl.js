const { Item } = require('../../models');
const CATEGORI = {
  background: 'background',
  etc: 'etc',
};

const index = async (req, res) => {
  // get all items
  try {
    const items = await Item.findAll({});
    return res.json(items);
  } catch (error) {
    return res.status(500).end();
  }
};

const show = async (req, res) => {
  // get item
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).end();
  try {
    const item = await Item.findOne({
      where: {
        id,
      },
    });
    if (!item) return res.status(204).end();
    return res.json(item);
  } catch (error) {
    return res.status(500).end();
  }
};

const create = async (req, res) => {
  // create item
  const item = req.body;
  if (!item.categori in CATEGORI) return res.status(400).end();

  try {
    const [newItem, created] = await Item.findOrCreate({
      where: {
        itemName: item.itemName,
      },
      defaults: {
        categori: item.categori,
        image: item.image,
        price: item.price,
        description: item.description,
      },
    });
    if (!created) return res.status(409).end();
    res.json(newItem);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).end();
    }
  }
};

const update = async (req, res) => {
  // update item

  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error('id not integer');
    }
    const { itemName, price, categori, description } = req.body;
    if (categori && !(categori in CATEGORI)) {
      throw new Error('no categori');
    }
    const item = await Item.findOne({
      where: {
        id,
      },
    });
    if (!item) {
      throw new Error('no item');
    }
    const duplicatedName = await Item.findOne({
      where: {
        itemName,
      },
    });
    if (duplicatedName) {
      throw new Error('duplicated name');
    }

    if (itemName) item.itemName = itemName;
    if (price) item.price = price;
    if (categori) item.categori = categori;
    if (description) item.description = description;

    await item.save();
    res.json(item);
  } catch (error) {
    if (error.message === 'duplicated name') {
      return res.status(409).end();
    } else if (error.message === 'no item') {
      return res.status(404).end();
    } else if (
      error.message === 'no categori' ||
      error.message === 'id not integer'
    ) {
      return res.status(400).end();
    }
    return res.status(500).end();
  }
};
module.exports = {
  index,
  show,
  create,
  update,
};

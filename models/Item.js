const Item = (sequelize, DataTypes) => {
  return sequelize.define('Item', {
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        isUrl: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = Item;

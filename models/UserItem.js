const UserItem = (sequelize, DataTypes) => {
  return sequelize.define('user_item', {
    isApplied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};

module.exports = UserItem;

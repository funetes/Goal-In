const Detail = (sequelize, DataTypes) => {
  return sequelize.define('Detail', {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};

module.exports = Detail;

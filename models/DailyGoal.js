const DailyGoal = (sequelize, DataTypes) => {
  return sequelize.define('DailyGoal', {
    retroRespact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validator: {
        isUrl: true,
      },
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        is: ['^\\d{4}\\.d{2}\\.d{2}$', 'i'],
      },
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = DailyGoal;

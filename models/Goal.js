const Goal = (sequelize, DataTypes) => {
  return sequelize.define('Goal', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        is: ['^\\d{4}\\.d{2}\\.d{2}\\-d{4}\\.d{2}\\.d{2}$', 'i'],
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isExpire: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};

module.exports = Goal;

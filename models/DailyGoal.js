const { checkValidationOfDate } = require('../utils/validate');
const DailyGoal = (sequelize, DataTypes) => {
  return sequelize.define('DailyGoal', {
    retroRespact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    states: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validateTerm: checkValidationOfDate,
      },
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = DailyGoal;

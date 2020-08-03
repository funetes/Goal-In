const { checkValidateTermFormat } = require('../utils/validate');
const Goal = (sequelize, DataTypes) => {
  return sequelize.define('Goal', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    term: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        validateTerm: checkValidateTermFormat,
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

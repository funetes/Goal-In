const User = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passWord: {
      type: DataTypes.STRING,
      allowNull: false,
      // 영문 숫자 포함 8자 이상
      validate: {
        min: 8,
        is: ['^[a-zA-Z0-9]*$', 'i'],
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    motto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
};

module.exports = User;

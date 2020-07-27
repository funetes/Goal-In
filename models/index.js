'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = require('./User')(sequelize, DataTypes);
db.Item = require('./Item')(sequelize, DataTypes);
db.Goal = require('./Goal')(sequelize, DataTypes);
db.DailyGoal = require('./DailyGoal')(sequelize, DataTypes);
db.Detail = require('./Detail')(sequelize, DataTypes);
db.UserItem = require('./UserItem')(sequelize, DataTypes);

require('./association')(db);

module.exports = db;

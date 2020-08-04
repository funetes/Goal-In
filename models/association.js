module.exports = db => {
  db.User.hasMany(db.Goal);
  // db.Goal.belongsTo(db.User);

  db.User.belongsToMany(db.Item, { through: db.UserItem });
  db.Item.belongsToMany(db.User, { through: db.UserItem });

  db.Goal.hasMany(db.DailyGoal);
  db.DailyGoal.belongsTo(db.Goal);

  db.DailyGoal.hasMany(db.Detail);
  db.Detail.belongsTo(db.DailyGoal);
};

module.exports = db => {
  db.User.hasMany(db.Goal);
  db.User.belongsToMany(db.Item, { through: db.UserItem });
  db.Item.belongsToMany(db.User, { through: db.UserItem });
  db.Goal.hasMany(db.DailyGoal);
  db.DailyGoal.hasMany(db.Detail);
};

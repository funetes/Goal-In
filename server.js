const app = require('./app');
const PORT = process.env.PORT || 3000;

const sequelize = require('./models').sequelize;

sequelize.sync({ force: true }).then(_ => {
  app.listen(PORT, () => {
    console.log('server on');
  });
});

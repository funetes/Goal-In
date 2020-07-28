require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASS,
    database: process.env.DB_DEV,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  test: {
    username: process.env.DB_TEST_USERNAME,
    password: process.env.DB_TEST_PASS,
    database: process.env.DB_TEST,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB,
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
};

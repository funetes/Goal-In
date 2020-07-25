const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const user = require('./api/user');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/users', user);

module.exports = app;

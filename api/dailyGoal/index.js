const express = require('express');
const Router = express.Router();
const ctrl = require('./dailyGoal.ctrl');

Router.get('/', ctrl.index);

Router.get('/:id', ctrl.show);

Router.post('/', ctrl.create);

Router.put('/:id', ctrl.update);

Router.delete('/:id', ctrl.destroy);

module.exports = Router;

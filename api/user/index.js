const express = require('express');
const ctrl = require('./user.ctrl');
const router = express.Router();

router.get('/', ctrl.index);

router.get('/:id', ctrl.show);

router.delete('/:id', ctrl.destroy);

router.post('/', ctrl.create);

router.post('/:userId/item/:itemId', ctrl.purchaseItem);

router.put('/:id', ctrl.update);

module.exports = router;

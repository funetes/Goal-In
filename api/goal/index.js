const express = require('express');
const ctrl = require('./goal.ctrl');
const router = express.Router();

// router.post('/', ctrl.index);

// router.get('/:id', ctrl.show);

router.post('/', ctrl.create);

// router.put('/:id', ctrl.update);

// router.delete('/:id', ctrl.destroy);

module.exports = router;

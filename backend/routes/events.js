const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);

/**
 * selectors
 */

router.get('/', events.selector.getAll);
router.get('/:id', events.selector.getById);

module.exports = router;

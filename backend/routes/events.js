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

module.exports = router;

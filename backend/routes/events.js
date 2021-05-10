const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

/**
 * selectors
 */

router.get('/', events.selector.getAll);

module.exports = router;

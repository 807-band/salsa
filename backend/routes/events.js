const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);
router.put('/:id', events.admin.updateEvent);
router.delete('/:id', events.admin.delete);

/**
 * selectors
 */

router.get('/', events.selector.getAll);
router.get('/:id', events.selector.getById);
router.get('/:id/members', events.selector.getEventMembers);

module.exports = router;

const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);
router.put('/:id', events.admin.updateEvent);
router.delete('/:id', events.admin.delete);
router.put('/:id/attendance', events.admin.putAttendance);

/**
 * selectors
 */

router.get('/', events.selector.getAll);
router.get('/:id', events.selector.getById);

module.exports = router;

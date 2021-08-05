const express = require('express');
const events = require('../controllers/events');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);
router.put('/:id', events.admin.updateEvent);
router.delete('/:id', events.admin.delete);

router.post('/:id/sub', events.admin.createSub);
router.put('/:id/sub', events.admin.updateSub);
router.delete('/:id/sub/:oldUserID', events.admin.deleteSub);

/**
 * selectors
 */

router.get('/', events.selector.getAll);
router.get('/:id', events.selector.getById);
router.get('/:id/members', events.selector.getEventMembers);

module.exports = router;

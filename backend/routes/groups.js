const express = require('express');

const router = express.Router();
const groups = require('../controllers/groups');

/**
 * Selectors
 */

router.get('/names', groups.selector.getGroupNames);
router.get('/:id', groups.selector.getGroupMembers);

/**
 * Admin Operations
 */

router.post('/', groups.admin.createGroup);
router.put('/:id', groups.admin.editGroup);

module.exports = router;

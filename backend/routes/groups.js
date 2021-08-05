const express = require('express');

const router = express.Router();
const groups = require('../controllers/groups');

/**
 * Selectors
 */

router.get('/names', groups.selector.getGroupNames);
router.get('/:id', groups.selector.getGroupMembers);
router.get('/byuser/:id', groups.selector.getGroupsByUser);

/**
 * Admin Operations
 */

router.post('/', groups.admin.createGroup);
router.put('/:id', groups.admin.editGroup);
router.delete('/:id', groups.admin.deleteGroup);

module.exports = router;

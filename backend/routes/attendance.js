const express = require('express');

const router = express.Router();
const attendance = require('../controllers/attendance');

/**
 * Selectors
 */

router.get('/groupnames', attendance.selector.getGroupNames);
router.get('/group/:id', attendance.selector.getGroupMembers);

module.exports = router;

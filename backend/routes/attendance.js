const express = require('express');
const attendance = require('../controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.put('/:id', attendance.admin.putAttendance);

/**
 * selector operations
 */

router.get('/:id', attendance.selector.getAttendance);

module.exports = router;

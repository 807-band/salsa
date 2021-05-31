const express = require('express');
const attendance = require('../controllers/attendance');

const router = express.Router();

/**
 * admin operations
 */

router.put('/:id', attendance.admin.putAttendance);

module.exports = router;

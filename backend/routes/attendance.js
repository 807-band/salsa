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

router.get('/byevent/:id', attendance.selector.getAttendanceByEvent);
router.get('/byuser/:id', attendance.selector.getAttendanceByUser);

module.exports = router;

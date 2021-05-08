const express = require('express');

const router = express.Router();
const users = require('../controllers/users');

/**
 * Selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);
router.get('/byname/:username', users.selector.getByUsername);
router.get('/:id/permissions', users.selector.getPermissions);

module.exports = router;

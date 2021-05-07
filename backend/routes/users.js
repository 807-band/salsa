const express = require('express');

const router = express.Router();
const users = require('../controllers/users');

/**
 * Selectors
 */

router.get('/', users.selector.getAll);
router.get('/:id', users.selector.getById);
router.get('/byname/:username', users.selector.getByUsername);

module.exports = router;

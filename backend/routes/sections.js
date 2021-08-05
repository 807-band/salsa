const express = require('express');

const router = express.Router();
const sections = require('../controllers/sections');

/**
 * Selectors
 */

router.get('/', sections.selector.getAll);
router.get('/:id', sections.selector.getById);

/**
 * Admin Operations
 */

router.post('/', sections.admin.create);
router.delete('/:id', sections.admin.delete);

module.exports = router;

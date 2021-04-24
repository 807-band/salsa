const express = require('express');
const stations = require('../controllers/stations');

const router = express.Router();

/*
 * selectors
 */
router.get('/', stations.selector.getAll);
router.get('/:id', stations.selector.getById);

module.exports = router;

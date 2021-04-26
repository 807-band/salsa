const express = require('express');
const stations = require('../controllers/stations');

const router = express.Router();

/*
 * admin operations
 */
router.post('/', stations.admin.create);
router.put('/:id', stations.admin.updateStation);
router.put('/:id/order', stations.admin.updateStationOrder);
router.delete('/:id', stations.admin.delete);

/*
 * selectors
 */
router.get('/', stations.selector.getAll);
router.get('/:id', stations.selector.getById);

module.exports = router;

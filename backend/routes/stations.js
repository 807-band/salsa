const express = require('express');
const stations = require('../controllers/stations');

const router = express.Router();

/**
 * admin operations
 */

router.post('/', stations.admin.create);
router.put('/:id', stations.admin.updateStation);
router.put('/:id/order', stations.admin.updateStationOrder);
router.delete('/:id', stations.admin.delete);

/**
 * selectors
 */

router.get('/', stations.selector.getAll);
router.get('/:id', stations.selector.getById);

/**
 * Grouping operations
 */

router.post('/:id', stations.grouping.createGrouping);
router.put('/:sid/:gid', stations.grouping.updateGrouping);
router.delete('/:sid/:gid', stations.grouping.deleteGrouping);

/**
 * Item operations
 */

router.post('/:sid/:gid/', stations.item.createItem);
router.put('/:sid/:gid/:iid', stations.item.updateItem);
router.delete('/:sid/:gid/:iid', stations.item.deleteItem);

module.exports = router;

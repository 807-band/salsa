import { Router } from 'express';
import * as events from '../controllers/events';

const router: Router = Router();

/**
 * admin operations
 */

router.post('/', events.admin.create);
router.put('/:id', events.admin.update);
router.delete('/:id', events.admin.deleteEvent);

/**
 * selectors
 */

router.get('/upcoming', events.selector.getUpcoming);
router.get('/recent', events.selector.getRecent);
router.get('/volunteer', events.selector.getVolunteer);
router.get('/:id', events.selector.getById);
router.get('/term/:id', events.selector.getByTermId);

export default router;

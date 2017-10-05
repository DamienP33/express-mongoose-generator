import * as express from 'express';
const router = express.Router();
import * as {controllerName} from {controllerPath};

/*
 * GET
 */
router.get('/', {controllerName}.list);

/*
 * GET
 */
router.get('/:id', {controllerName}.show);

/*
 * POST
 */
router.post('/', {controllerName}.create);

/*
 * PUT
 */
router.put('/:id', {controllerName}.update);

/*
 * DELETE
 */
router.delete('/:id', {controllerName}.remove);

export = router;

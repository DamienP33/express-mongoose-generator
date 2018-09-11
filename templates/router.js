let express = require('express');
let router = express.Router();
let {controllerName} = require({controllerPath});

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

module.exports = router;

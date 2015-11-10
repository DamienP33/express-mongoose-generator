var express = require('express');
var router = express.Router();
var {controllerName} = require('../controllers/{controllerName}.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    {controllerName}.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    {controllerName}.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    {controllerName}.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    {controllerName}.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    {controllerName}.remove(req, res);
});

module.exports = router;

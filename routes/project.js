var express = require('express');
var router = express.Router();

/* Request to create a new project */
router.post('/new', function(req, res, next) {
});

/* Request to delete a new project */
router.delete('/:id', function(req, res, next) {
});

/* Get the status of a specified project */
router.get('/:id/status', function(req, res, next) {
});

/* Activate of deactivate a specified project */
router.post('/:id/status', function(req, res, next) {
});

/* Get all cards of a specified project */
router.get('/:id/cards', function(req, res, next) {
});

/* Create a new card */
router.post('/:id/cards/new', function(req, res, next) {
});

/* Get a card's content */
router.get('/:id/cards/:cid', function(req, res, next) {
});

/* Update a specified card */
router.post('/:id/cards/:id', function(req, res, next) {
});

/* Delete a card */
router.delete('/:id/cards/:cid', function(req, res, next) {
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* Request to create a new project */
route.post('/new', function(req, res, next) {
});

/* Request to delete a new project */
route.delete('/:id', function(req, res, next) {
});

/* Get the status of a specified project */
route.get('/:id/status', function(req, res, next) {
});

/* Activate of deactivate a specified project */
route.post('/:id/status', function(req, res, next) {
});

/* Get all cards of a specified project */
route.get('/:id/cards', function(req, res, next) {
});

/* Create a new card */
route.post('/:id/cards/new', function(req, res, next) {
});

/* Get a card's content */
route.get('/:id/cards/:cid', function(req, res, next) {
});

/* Update a specified card */
route.post('/:id/cards/:id', function(req, res, next) {
});

/* Delete a card */
route.delete('/:id/cards/:cid', function(req, res, next) {
});

module.exports = router;

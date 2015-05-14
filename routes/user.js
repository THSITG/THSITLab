var express = require('express');
var router = express.Router();

/* login API */
router.post('/login', function(req, res, next) {
});

/* logout API */
router.post('/logout', function(req, res, next) {
});

/* Get the profile of a specified user */
router.get('/:id/profile', function(req, res, next) {
});

/* Update a user's profile */
router.post('/:id/profile', function(req, res, next) {
});

/* Get the projects of a specified user */
router.get('/:id/projects', function(req, res, next) {
});

module.exports = router;

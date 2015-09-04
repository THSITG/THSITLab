var express = require('express');
var userUtils = require('../utils/user.js');
var router = express.Router();

/* login API */
router.post('/login', function(req, res, next) {
  if(req.session.uid) {
    //req.session.regenerate();
    //TODO: we need a promise here
  }

  if(!req.body) return res.sendStatus(403);

  if(!req.body.name || !req.body.passwd) {
    return res.send({
      success: false,
      error: {
        name: (req.body.name == null || req.body.name == ""),
        passwd: (req.body.passwd == null || req.body.passwd == ""),
        map:{
          "empty-name": (req.body.name == null || req.body.name == ""),
          "empty-passwd": (req.body.passwd == null || req.body.passwd == "")
        }
      }
    });
  }

  // We don't need force offline (now)
  // Stores the user id right away

  var user = userUtils.login(req.body.name, req.body.passwd);

  if(!user) {
    return res.send({
      success: false,
      error: {
        name: false,
        passwd: true,
        map: {
          "invalid-credentials": true
        }
      }
    });
  } else {
    req.session.uid = userUtils.getId(user);
    return res.send({
      success: true,
      user: userUtils.digest(user)
    });
  }
});

/* register API */
router.post('/register', function(req, res, next) {
  // TODO: not supported
  res.sendStatus(400);
});

/* logout API */
router.post('/logout', function(req, res, next) {
  req.destory(function(err) {
    if(err) next(err);
    else res.send({ success: true });
  });
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

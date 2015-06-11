var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'THSITLab' });
});

router.get('/content/test', function(req, res, next) {
  res.render('content/test');
});

router.get('/content/home', function(req, res, next) {
  res.render('content/home');
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/:path*?', function(req, res, next) {
  console.log(req.params.path);
  res.render('content/'+req.params.path);
});

module.exports = router;

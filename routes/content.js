var express = require('express');
var router = express.Router();

router.get('/:path*?', function(req, res, next) {
  res.render('content/'+req.params.path);
});

module.exports = router;

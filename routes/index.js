var express = require('express');
var router = express.Router();

var titleMap = {
  'home': "Homepage",
  'test': "Test Title"
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { content: 'home', title: titleMap['home']});
});

router.get('/:content*?', function(req, res, next) {
  var cont = req.params.content;
  console.log(cont);
  res.render('index', { content: cont, title: titleMap[cont]});
});

module.exports = router;

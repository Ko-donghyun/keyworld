var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/test', function(req, res, next) {
  res.json({
    success: '1',
    message: 'success',
  })
});
module.exports = router;

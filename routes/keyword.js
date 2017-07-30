const express = require('express');
const router = express.Router();

const keywordController = require('./../controller/keyword.js');

/**
 * To find the Keyword when it has any other previous relations
 */
router.get('/', function(req, res, next) {
  const keyword = req.query.keyword;

  return keywordController.search(keyword).then((result) => {
    return res.json({
      success: 1,
      result,
    })
  }).catch((err) => {
    return next(err);
  });
});

/** 
  * To find the Keyword when it has previous relations 
  */ 
router.get('/extension', function(req, res, next) {
   const previousKeyword = req.query.previousKeyword; 
  const keyword = req.query.keyword;

  return keywordController.extensionSearch(keyword, previousKeyword).then((result) => {
    return res.json({
      success: 1,
      result,
    })
  }).catch((err) => {
    return next(err);
  });
 });

module.exports = router;

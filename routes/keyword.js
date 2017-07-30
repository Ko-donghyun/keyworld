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
  * To save the Keyword when it has any other previous relations 
  */ 
router.post('/', function(req, res, next) {
  const keyword = req.body.keyword;
  const newKeyword = req.body.newKeyword;

  return keywordController.addKeyword(keyword, newKeyword).then((result) => {
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


/** 
 * To save the Keyword when it has previous relations 
 */
router.post('/extension', function(req, res, next) {
  const previousKeyword = req.body.previousKeyword;
  const keyword = req.body.keyword;
  const newKeyword = req.body.newKeyword;

  return keywordController.addKeywordWithRelation(keyword, previousKeyword, newKeyword).then((result) => {
    return res.json({
      success: 1,
      result,
    })
  }).catch((err) => {
    return next(err);
  });
});


/** 
 * To remove the Keyword
 */
router.post('/report', function(req, res, next) {
  const ancestorKeyword = req.body.ancestorKeyword;
  const parentKeyword = req.body.parentKeyword;
  const keyword = req.body.keyword;
  const email = req.body.email;

  return keywordController.reportKeyword(ancestorKeyword, parentKeyword, keyword, email).then((result) => {
    return res.json({
      success: 1,
      result,
    })
  }).catch((err) => {
    return next(err);
  });
});

module.exports = router;

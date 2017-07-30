var sequelize = require('./../sequelize-config.js');

const Keyword = require('./../model/keyword.js');
const Line = require('./../model/line.js');
const helper = require('./helper.js');

/**
 * To find the Keyword when it has any other previous relations
 *
 * @param {String} keyword
 * @returns {Object}
 */
exports.search = function(keyword) {
  return new Promise((resolve, reject) => {
    return Keyword.findOrCreate({
      where: {label: keyword}
    }).spread((keyword, created) => {
      return sequelize.query(`SELECT keyword.label FROM \`lines\` AS line JOIN \`keywords\` AS keyword ON line.middle = keyword.id WHERE line.top = :keywordId AND line.bottom IS null;`,
        { replacements: { keywordId: keyword.id }, type: sequelize.QueryTypes.SELECT }
      ).then(result => {
        resolve(result);
      })
    });
  });
};



/**
 * To save the Keyword when it has any other previous relations 
 *
 * @param {String} keyword
 * @param {String} newKeyword
 * @returns {Object}
 */
exports.addKeyword = function(keyword, newKeyword) {
  let resultKeyword;
  let resultNewKeyword;

  return new Promise((resolve, reject) => {
    return Keyword.findOne({
      where: {label: keyword}
    }).then((keyword) => {
      resultKeyword = keyword;

      if (!keyword) {
        return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that Keyword'))
      }

      return Keyword.findOrCreate({where: {label: newKeyword}}).spread((newKeyword, created) => {
        resultNewKeyword = newKeyword;

        return Line.bulkCreate([
          { top: resultKeyword.id , middle: newKeyword.id },
          { top: newKeyword.id , middle: resultKeyword.id },
        ]).then((result) => {
          resolve(result);
        })
      })
    });
  });
};

/**
 * To find the Keyword when it has previous relations 
 *
 * @param {String} keyword
 * @param {String} previousKeyword
 * @returns {Object}
 */
exports.extensionSearch = function(keyword, previousKeyword) {
  let resultKeyword;
  let resultPreviousKeyword;

  return new Promise((resolve, reject) => {
    return Keyword.findOne({
      where: {label: keyword}
    }).then((keyword) => {
      resultKeyword = keyword;
      if (!keyword) {
        return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that Keyword'))
      }

      return Keyword.findOne({
        where: {label: previousKeyword}
      }).then((previousKeyword) => {
        resultPreviousKeyword = previousKeyword;

        if (!previousKeyword) {
          return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that Keyword'))
        }

        return sequelize.query(`SELECT line.id, keyword.label FROM \`lines\` AS line JOIN \`keywords\` AS keyword ON line.bottom = keyword.id WHERE line.top = :previousKeywordId AND line.middle = :keywordId AND line.bottom IS NOT null;`,
          { replacements: { keywordId: resultKeyword.id, previousKeywordId: resultPreviousKeyword.id }, type: sequelize.QueryTypes.SELECT }
        ).then(result => {
          resolve(result);
        })
      })
    });
  });
};

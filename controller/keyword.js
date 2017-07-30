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
    return Keyword.findOne({
      where: {label: keyword}
    }).then((keyword) => {
      if (!keyword) {
        return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that Keyword'))
      }

      return sequelize.query(`SELECT keyword.label FROM \`lines\` AS line JOIN \`keywords\` AS keyword ON line.middle = keyword.id WHERE line.top = :keywordId AND line.bottom IS null;`,
        { replacements: { keywordId: keyword.id }, type: sequelize.QueryTypes.SELECT }
      ).then(result => {
        resolve(result);
      })
    });
  });
};

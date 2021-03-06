const SparkPost = require('sparkpost');
var sequelize = require('./../sequelize-config.js');

const credentials = require('./../credentials.js');
const sparky = new SparkPost(credentials.sparkpost.api);

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
      if (created) {
        return resolve([]);
      }

      return sequelize.query(`SELECT line.id, keyword.label, line.preference FROM \`lines\` AS line JOIN \`keywords\` AS keyword ON line.middle = keyword.id WHERE line.top = :keywordId AND line.bottom IS null;`,
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

        return Line.findOrCreate({where: {top: resultKeyword.id , middle: newKeyword.id}}).spread((newLine, created) => {
          if (!created) {
            return reject(new helper.makePredictableError(200, 401, 'Already Inserted that Keyword'))
          }

          return Line.create({ top: newKeyword.id , middle: resultKeyword.id }).then((result) => {
            resolve('Successfully inserted!');
          })
        });
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

        return sequelize.query(`SELECT line.id, keyword.label, line.preference FROM \`lines\` AS line JOIN \`keywords\` AS keyword ON line.bottom = keyword.id WHERE line.top = :previousKeywordId AND line.middle = :keywordId AND line.bottom IS NOT null;`,
          { replacements: { keywordId: resultKeyword.id, previousKeywordId: resultPreviousKeyword.id }, type: sequelize.QueryTypes.SELECT }
        ).then((result) => {

          let searchResult = result;
          return Line.increment('preference', { where: { middle: resultKeyword.id, top: resultPreviousKeyword.id, bottom: {$eq: null}}}).then(() => {
            resolve(searchResult);
          })
        })
      })
    });
  });
};


/**
 * To save the Keyword when it has any other previous relations 
 *
 * @param {String} keyword
 * @param {String} previousKeyword
 * @param {String} newKeyword
 * @returns {Object}
 */
exports.addKeywordWithRelation = function(keyword, previousKeyword, newKeyword) {
  let resultKeyword;
  let resultPreviousKeyword;
  let resultNewKeyword;

  return new Promise((resolve, reject) => {
    return Keyword.findOne({
      where: {label: previousKeyword}
    }).then((previousKeyword) => {
      resultPreviousKeyword = previousKeyword;

      if (!previousKeyword) {
        return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that previousKeyword'))
      }

      return Keyword.findOne({
        where: {label: keyword}
      }).then((keyword) => {
        resultKeyword = keyword;

        if (!keyword) {
          return reject(new helper.makePredictableError(200, 404, 'Can\'t not find that Keyword'))
        }

        return Keyword.findOrCreate({where: {label: newKeyword}}).spread((newKeyword, created) => {
          resultNewKeyword = newKeyword;

          return Line.create({ top: resultPreviousKeyword.id, middle: resultKeyword.id, bottom: newKeyword.id }).then((result) => {
            return Line.findOrCreate({where: {top: resultKeyword.id , middle: newKeyword.id}}).spread((newLine, created) => {
              if (!created) {
                return reject(new helper.makePredictableError(200, 401, 'Already Inserted that Keyword'))
              }

              return Line.create({ top: newKeyword.id , middle: resultKeyword.id }).then((result) => {
                resolve('Successfully inserted!');
              })
            });
          }).catch((err) => {
            return reject(new helper.makePredictableError(200, 501, 'Already Inserted that Keyword'))
          })
        })
      });
    });
  });
};


/**
 * To remove the keyword
 *
 * @param {String} ancestorKeyword
 * @param {String} parentKeyword
 * @param {String} keyword
 * @param {String} email
 * @returns {Object}
 */
exports.reportKeyword = function(ancestorKeyword, parentKeyword, keyword, email) {
  return new Promise((resolve, reject) => {

    sparky.transmissions.send({
      content: {
        from: 'report@email.keyworld.space',
        subject: `Keyword Reported about '${keyword}'`,
        html:`<html><body><p>ancestorKeyword: ${ancestorKeyword}, \n parentKeyword: ${parentKeyword}, \n keyword: ${keyword}, \n email: ${email}</p></body></html>`
      },
      recipients: [
        {address: 'angelhack.team.keyworld@gmail.com'}
      ]
    })
      .then(data => {
        console.log('Woohoo! You just sent your first mailing!');
        console.log(data);
        resolve(data);
      })
      .catch(err => {
        console.log('Whoops! Something went wrong');
        console.log(err);
        return reject(new helper.makePredictableError(200, 501, 'Something went wrong'))
      });
  });
};

/**
 * Return that can be Predictable Error
 *
 * @param {number} statusCode
 * @param {number} customCode
 * @param {String} message
 */
exports.makePredictableError = function(statusCode, customCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.customCode = customCode;
  return err;
};

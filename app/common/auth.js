var utils = require('./utils')

/**
 * ��¼
 */
exports.login = function (res, user) {
  utils.setCookie(res, "u", user);
}
exports.logout = function (res) {
  utils.setCookie(res, "u", '', -1);
}

/**
 * ��Ҫ����ԱȨ��
 */
exports.adminRequired = function (req, res, next) {
  next();
}

/**
 * ��Ҫ��¼
 */
exports.userRequired = function (req, res, next) {
 var user = utils.getCookie(req, 'u');
 if ( user ) {
   req.user = user;
 } else {
   return res.send('please <a href="/login">login</a>.');
 }
 next();
}
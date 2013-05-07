var utils = require('./utils')

/**
 * 登录
 */
exports.login = function (res, user) {
  utils.setCookie(res, "u", user);
}
exports.logout = function (res) {
  utils.setCookie(res, "u", '', -1);
}

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
  next();
}

/**
 * 需要登录
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
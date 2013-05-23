var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('./utils')
  , authCookieName = 'u'

/**
 * 登录
 */
exports.login = function (res, user) {
  utils.setCookie(res, authCookieName, user);
}
exports.logout = function (res) {
  utils.setCookie(res, authCookieName, '', -1);
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
  var user = utils.getCookie(req, authCookieName);
  if ( user ) {
    exports.user(req, res, next, user.username);
   // req.user = user;
	//console.log(user);
   // next();
  } else {
    return res.send('please <a href="/login">login</a>.');
  }
}

/**
 * Find user by username
 */
exports.user = function (req, res, next, username) {
  User
    .findOne({ username : username })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + username));
      req.user = user;
      //console.log(user);
      next();
    })
}
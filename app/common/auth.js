var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('./utils')
  , config = process.appConfig
  , authCookieName = config.authCookieName

exports.get = function (req) {
	return utils.getCookie(req, config.authCookieName);
}

/**
 * 登录
 */
exports.login = function (req, res, user) {
	utils.setCookie(req, res, authCookieName, user);
}
exports.logout = function (req, res) {
	utils.setCookie(req, res, authCookieName, '', -1);
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
	var cookie = utils.getCookie(req, authCookieName);

	if ( cookie ) {
		req.user = cookie;
		next()
	} else {
		next(new Error('please login first'))
	}
}

/**
 * Find user by username
 */
exports.user = function (req, res, next, username) {
/*
	User
	.findOne({ username : username }, )
	.exec(function (err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + username));
		req.user = user;
		console.log(username, user);
		next();
	})
*/
	User.findOne({ username : username }, function (err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + username));
		//console.log(username, user);
		next();
	})
}
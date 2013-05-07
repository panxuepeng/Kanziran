var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../common/utils')
  , auth = require('../common/auth')
  
exports.login = function (req, res) {
  var user = {name:"panxuepeng"};
  auth.login(res, user);
  res.send('login.');
}

exports.logout = function (req, res) {
  auth.logout(res);
  res.send('logout.');
}

exports.index = function (req, res) {
  //res.send('hello ');
  res.send('hello '+req.user.name);
}

exports.create = function (req, res) {
  var post = {
    name: 'ddff'
    , email: 'sdfdsf'
    , username: 'panxuepeng'
  };
  
  var user = new User(post);
  
  user.save(function (err) {
    if (err) {
      //return res.send('users/signup', { errors: err.errors, user: user })
		/*
		err.errors =
		{ email:
		   { message: 'Validator "Email cannot be blank" failed for path email with value ``',
			 name: 'ValidatorError',
			 path: 'email',
			 type: 'Email cannot be blank',
			 value: '' },
		  ...
		}
		*/
      return res.send('users create error')
    }
    
    return res.send('users create success');
  })
  
}

exports.show = function (req, res) {
  var user = req.user
  return res.send(JSON.stringify(user));
}

/**
 * Find user by username
 */
exports.user = function (req, res, next, username) {
  User
    .find({ username : username })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + username))
      req.user = user
      next()
    })
}
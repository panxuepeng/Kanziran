var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../common/utils')
  , auth = require('../common/auth')
  
exports.login = function (req, res) {
  var user = {username:"panxuepeng", password: utils.md5('panxuepeng')};
  
    User
    .find({ username: user.username,  password: utils.md5(user.password)})
    .exec(function (err, user) {
      if (err) {
        res.send('error.');
      } else if (!user) {
        res.send('not found user.');
      } else {
        auth.login(res, user);
        res.send('login.');
      }
    });
}

exports.logout = function (req, res) {
  auth.logout(res);
  res.send('logout.');
}





exports.create = function (req, res) {
  var post = {
     username: 'panxuepeng'
    , password: utils.md5(utils.md5('panxuepeng'))
    , role: 8
  };
  
  var user = new User(post);
  
  user.save(function (err) {
    if (err) {
      console.log(err);
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


exports.index = function (req, res) {
  //res.send('hello ');
  res.send('hello '+req.user.name);
}

exports.show = function (req, res) {
  var user = req.user
  return res.send(JSON.stringify(user));
}


var C = require("../common/index")
  , User = C.model('User')
  , utils = C.utils
  , auth = C.auth

var users = C('users', {

	login: function(req, res) {
		var user = {username:"panxuepeng", password: utils.md5('panxuepeng')};

		User
		.findOne({ username: user.username,  password: utils.md5(user.password)})
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
	},
	
	create: function(req, res) {
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
	},
	
	logout: function(req, res) {
		auth.logout(res);
		res.send('logout.');
	},
	
	show: function(req, res) {
		var user = req.user
		return res.send(JSON.stringify(user));
	}
});


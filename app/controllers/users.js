var C = require("../common/index")
  , User = C.model('User')
  , utils = C.utils
  , auth = C.auth
  , config = C.config

var users = C('users', {
	login: function(req, res) {
		var post = req.body
		var username = post.username.trim()
		var password = post.password.trim()
	
		User.findOne({ username: username,  password: password}).exec(function (err, user) {
			if (err) {
				res.jsonp([500, err]);
			} else if (!user) {
				res.jsonp([404, '用户不存在']);
			} else {
				auth.login(req, res, user);
				res.jsonp([200, '登录成功']);
			}
		});
	},
	
	logout: function(req, res) {
		auth.logout(req, res);
		res.jsonp([200, '退出成功']);
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
	
	show: function(req, res) {
		var user = auth.get(req);
		if (user) {
			res.jsonp([200, user]);
		} else {
			res.jsonp([404, 'not found user.']);
		}
	}
});


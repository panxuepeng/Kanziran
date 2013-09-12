var express = require('express')
  , auth = require('../common/auth')

module.exports = function (app, config) {
	// should be placed before express.static
	app.use(express.compress({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
		},
		level: 9
	}));
	app.use(express.static(config.path['static']));

	// 所有环境
	app.set('title', 'Kanziran.com');
	if ('development' === app.get('env')) {
		app.set('showStackError', true);
	}

	// cookieParser should be above session
	app.use(express.cookieParser())

	// 所有的非GET请求，除了登录验证 post /login
	//都需要登录验证
	// 这里统一处理，路由设置文件不再需要逐个处理

	app.use(function(req, res, next){
		req.time = new Date
		
		if ( req.method === 'GET' || req.path === '/login' ) {
			next();
		} else {
			auth.userRequired(req, res, next);
		}
	})

	// bodyParser should be above methodOverride
	app.use(express.bodyParser({limit:config.postLimit}))
	app.use(express.methodOverride())

	// routes should be at the last
	app.use(app.router)


	// assume "not found" in the error msgs
	// is a 404. this is somewhat silly, but
	// valid, you can do whatever you like, set
	// properties, use instanceof etc.
	app.use(function(err, req, res, next){
		// treat as 404
		if (~err.message.indexOf('not found')) return next()

		// log it
		console.error(err.stack)

		// error page
		res.status(500).render('500', { error: err.stack })
	})

	// assume 404 since no middleware responded
	app.use(function(req, res, next){
		res.send(404, 'Sorry, we cannot find that!');
		//res.status(404).render('404', { url: req.originalUrl, error: 'Not found' })
	})
}

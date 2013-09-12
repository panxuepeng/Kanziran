/*
GET	/resource	index	resource.index
GET	/resource/create	create	resource.create
POST	/resource	store	resource.store
GET	/resource/{id}	show	resource.show
GET	/resource/{id}/edit	edit	resource.edit
PUT/PATCH	/resource/{id}	update	resource.update
DELETE	/resource/{id}	destroy	resource.destroy
*/
var auth = require('../common/auth')
  , userRequired = auth.userRequired // 登录验证过滤器

module.exports = function (app, C) {
	
	var u = C('users')
	app.get('/user', u.show)
	app.post('/login', u.login)
	app.get('/logout', u.logout)
	app.get('/signup', u.create)

	// 中间件
	// 当路由当中出现 :username 时，
	// 会先执行这个方法获取相关信息后，再执行路由绑定的方法
	//app.param('username', users.user)

	var topics = C('topics');
	app.get('/', topics.get);
//	app.get('/topics/create', userRequired, topics.create);
	app.get('/topics', topics.index);
	app.get('/topics/:topid', topics.show);
	app.get('/topics/update/:topicid', userRequired, topics.update);
	
	app.post('/topics', topics.create);
	
	//更新操作需验证作者身份
	app.put('/topics/:topicid', topics.auth, topics.update);
	app.del('/topics/:topicid', topics.auth, topics.destroy);

	
	var photos = C('photos');
	app.get('/photos', photos.index);
	app.post('/photos', photos.upload);
	app.put('/photos/:photoid', photos.auth, photos.update);
	app.del('/photos/:photoid', photos.auth, photos.destroy);

}
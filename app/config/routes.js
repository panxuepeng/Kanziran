var auth = require('../common/auth')
module.exports = function (app, C) {

	var users = C('users')
	app.get('/login', users.login)
	app.get('/logout', users.logout)
	app.get('/create', auth.userRequired, users.create)

	// �м��
	// ��·�ɵ��г��� :username ʱ��
	// ����ִ�����������ȡ�����Ϣ����ִ��·�ɰ󶨵ķ���
	//app.param('username', users.user)

	var topics = C('topics');
	app.get('/', topics.get);
	app.get('/topics/create', auth.userRequired, topics.create);
	app.get('/topics', topics.index);
	app.get('/topics/:topid', topics.show);
	app.post('/topics', topics.create);
	app.put('/topics/:topicid', topics.update);
	app.get('/topics/update/:topicid', auth.userRequired, topics.update);
	app.del('/topics/:topicid', topics.destroy);

	var photos = C('photos');
	app.post('/photos', photos.uploadPhoto);
	app.get('/photos', photos.uploadPhoto);
	app.put('/photos/:photoid', photos.update);
	app.del('/photos/:photoid', photos.destroy);
}
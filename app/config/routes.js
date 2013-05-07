var auth = require('../common/auth');

module.exports = function (app) {

  // user routes
  var users = require('../controllers/users')
  
  app.get('/', auth.userRequired, users.index)
  
  app.get('/login', users.login)
  
  app.get('/logout', users.logout)
  app.get('/create', auth.userRequired, users.create)
  
  app.get('/users/:username', users.show)
  
  // �м��
  // ��·�ɵ��г��� :username ʱ��
  // ����ִ�����������ȡ�����Ϣ����ִ��·�ɰ󶨵ķ���
  app.param('username', users.user)
}

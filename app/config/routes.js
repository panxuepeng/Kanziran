var auth = require('../common/auth');

module.exports = function (app) {
  function control(name) {
    return require('../controllers/'+name)
  }

  // user routes
  var users = control('users')
  
  //app.get('/', auth.userRequired, users.index)
  app.get('/login', users.login)
  app.get('/logout', users.logout)
  app.get('/create', auth.userRequired, users.create)
  //app.get('/users/:username', users.show)
  
  app.post('/login', users.login)
  
  
  // �м��
  // ��·�ɵ��г��� :username ʱ��
  // ����ִ�����������ȡ�����Ϣ����ִ��·�ɰ󶨵ķ���
  //app.param('username', users.user)
  
  var topics = control('topics');
  app.get('/', topics.index);
  app.get('/topics', topics.index);
  app.get('/topics/:topid', topics.show);
  
  app.post('/topics', topics.create);
  
  app.put('/topics/:topicid', topics.update);
  
  app.del('/topics/:topicid', topics.destroy);
  
  var photos = control('photos');
  app.post('/photos', auth.userRequired, photos.isExist, photos.getExif, photos.saveFile, photos.saveDB);
  app.get('/photos', auth.userRequired, photos.isExist, photos.getExif, photos.saveFile, photos.saveDB);
  app.put('/photos/:photoid', photos.update);
  app.del('/photos/:photoid', photos.destroy);
}

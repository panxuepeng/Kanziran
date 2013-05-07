var auth = require('../common/auth');

module.exports = function (app) {

  // user routes
  var users = require('../controllers/users')
  
  app.get('/', auth.userRequired, users.index)
  
  app.get('/login', users.login)
  
  app.get('/logout', users.logout)
  app.get('/create', auth.userRequired, users.create)
  
  app.get('/users/:username', users.show)
  
  // 中间件
  // 当路由当中出现 :username 时，
  // 会先执行这个方法获取相关信息后，再执行路由绑定的方法
  app.param('username', users.user)
}

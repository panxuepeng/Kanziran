var path = require('path')
  , rootPath = path.normalize(__dirname + '/../..')
console.log(rootPath);
module.exports = {
  development: {
    db: 'mongodb://localhost:27017/kanziran',
    root: rootPath,
    path: {
      photo: rootPath+'/photo'
    },
    app: {
      name: 'Kanziran'
    },
    cookieSecret: 'hello',
    cookieExpires: 3600000 * 24 * 30, // 默认有效期30天
    port: 5000,
    thumbList: [[270, 480], [970, 2080]]
  },
  test: {

  },
  production: {
  
  }
}
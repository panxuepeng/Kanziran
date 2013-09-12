var path = require('path')
  , rootPath = path.normalize(__dirname + '/../..')

module.exports = {
	development: {
		db: 'mongodb://localhost:27017/kanziran',
		root: rootPath,
		path: {
			photo: rootPath+'/photo',
			'static': rootPath+'/public'
		},
		app: {
			name: 'Kanziran'
		},
		authCookieName: 'u', // 用于身份验证的cookie name
		cookieSecret: 'hello', // cookie加密的私钥
		cookieExpires: 3600000 * 24 * 30, // 默认有效期30天
		postLimit: 1048576*5,
		port: 5000,
		
		// 图片尺寸必须从小到大，thumbList[0][0] 为默认缩略图尺寸
		thumbList: [[270, 480], [970, 2080]]
	},
	test: {

	},
	production: {

	}
}
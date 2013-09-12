var C = require("../common/index")
  , upload = require("./_upload")
  , User = C.model('User')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , async = C.async
  , _ = C._
  , config = process.appConfig
  
var control = {};

// 获取主题所属的图片信息
control.index = function(req, res) {
	
	res.send('update');
}

/**
 * 作者身份验证
 * 
 */
control.auth = function(req, res, next) {
	var photoid = req.body.photoid
	Photo.findOne({ _id: photoid}).exec(function (err, result) {
		if (err) {
			res.jsonp([500, err])
		} else if (!result) {
			res.jsonp([404, '图片不存在'])
		} else if ( req.user._id === result.user_id ) {
			next()
		} else {
			res.jsonp([403, '没有修改权限'])
		}
	})
}

// 更新图片信息
control.update = function(req, res) {
	var post = req.body
	var photoid = post.photoid
	
	Photo.update({_id: photoid}, {
		description: post.description
		, updated_at: req.time
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '更新失败'])
			: res.jsonp([200, '更新成功'])
	})
}

// 上传图片
// 客户端默认使用plupload
// 上传成功返回示例 {"id":"id","url":"url"}
// 上传失败返回示例 {"error":1,"msg":"Failed to save."}
control.upload = function(req, res) {
	async.series( upload(req, res), function(err, results) {
		if (err) {
			res.jsonp({error:1, msg: err})
		} else {
			res.jsonp({id:results['insert'], url:results['write'] })
		}
	});
}

// 删除图片
control.destroy = function(req, res) {
	var photoid = req.query.photoid

	Photo.remove({_id: photoid}, function(err, numberAffected) {
		if (err) {
			return res.jsonp([500, err])
		}
		return res.jsonp([200, '删除成功'])
	});
}

var photos = C('photos', control);
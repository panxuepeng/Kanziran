var C = require("../common/index")
  , shell = require('shelljs')
  , fs = require('fs')
  , gm = require('gm')
  , User = C.model('User')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , async = C.async
  , _ = C._
  , config = process.appConfig
  
var control = {};

function series(req, res) {
	return {
		// 判断图片是否已存在
		// 不存在时进入下一步，直接返回图片路径
		check: function(cb) {
			
			if ( !req.files.photo ) {
				cb('未检测到上传图片');
			} else if (req.files.photo.type.substr(0, 5) !== 'image') {
				cb('只能上传图片文件');
			} else if (req.files.photo.length > config.postLimit ) {
				cb('只能上传10M内的图片文件');
			}
			
			cb(null, true);
		},
		
		isExist: function(cb) {
			var path = req.files.photo.path;
			fs.readFile(path, function (err, data) {
				var photoMd5 = utils.md5(data);
				req.photoMd5 = photoMd5;
				req.photoData = data;
				
				Photo
				.findOne({ mark: photoMd5})
				.exec(function (err, photo) {
					if (err) {
						cb(err);
					} else if ( _.isEmpty(photo) ) {
						// 图片不存在，继续
						cb(null, true);
					} else {
						// 图片以及存在，直接返回
						res.jsonp({id:photo._id, url:getPhotoUrl(photo)});
					}
				});
			});
		},
		
		// 获取照片的元信息
		getExif: function(cb) {
			gm(req.photoData)
			.identify(function(err, exif){
				// 删除一些没用，但是比较长的字段信息
				delete exif['Profile-EXIF']['Maker Note'];
				delete exif['Profile-EXIF']['0xC4A5'];
				delete exif['Profile-EXIF']['User Comment'];
				
				req.photoExif = exif;
				//console.log(exif);
				if (err) {
					cb(err);
				} else{
					cb(null, true);
				}
			})
		},
		
		// 保存原始图片和缩略图
		write: function(cb) {
			var savePath = getSavePath(req.photoMd5);
			var photoData = req.photoData;
			// 创建缩略图
			fs.writeFile(savePath, photoData, function(err) {
				if (err) {
					cb(err);
				} else {
					var thumbPath;
					async.eachLimit(config.thumbList, 2, function(item, cb2) {
						thumbPath = savePath.replace('photo', 'public/photo/'+item[0]);
						
						gm(photoData)
						.noProfile()
						.resize(item[0], item[1])
						.write(thumbPath, function (err2) {
							cb2(err2);
						});
					}, function(err3) {
						var url = thumbPath.split('public')[1]
						url = url.replace(/photo\/\d{3,4}/, 'photo/'+config.thumbList[0][0])
						cb(err3, url);
					});
				}
			});
		},
		
		// 保存到数据库
		insert: function(cb) {
			var photo = Photo.create({
				exif: req.photoExif
				, uid: null
				, photoData: req.photoData
				, photoMd5: req.photoMd5
			});
			delete req.photoExif;
			delete req.photoData;

			photo.save(function(err, result) {
				if (err) {
					cb(err);
				} else {
					cb(null, result._id);
				}
			});
			
		}
	}
}

// 上传图片
// 客户端默认使用plupload
// 上传成功返回示例 {"id":"id","url":"url"}
// 上传失败返回示例 {"error":1,"msg":"Failed to save."}
control.index = function(req, res) {
	async.series( series(req, res), function(err, results) {
		if (err) {
			res.jsonp({error:1, msg: err})
		} else {
			res.jsonp({id:results['insert'], url:results['write'] })
		}
	});
}

// 返回图片url地址
function getPhotoUrl(photo, size) {
	var d = new Date(photo.created_at)
	size = size || config.thumbList[0][0]
	year = d.getFullYear()
	month = d.getMonth()+1
	day = d.getDate()
	month = (month > 9) ? month: '0'+month
	day = (day > 9) ? day: '0'+day
	
	return "photo/"+size+"/"+year+""+month+"/"+day+"/"+photo.mark+".jpg"
}

// 返回图片保存地址
function getSavePath(mark) {
	var d = new Date
	year = d.getFullYear()
	month = d.getMonth()+1
	day = d.getDate()
	month = (month > 9) ? month: '0'+month
	day = (day > 9) ? day: '0'+day
	
	var path = config.root + "/photo/"+year+""+month+"/"+day
	if (!shell.test('-d', path)) {
		shell.mkdir('-p', path);
		_.each(config.thumbList, function(item){
			shell.mkdir('-p', path.replace('photo', 'public/photo/'+item[0]));
		})
	}
	return path+"/"+mark+".jpg"
}

var uploadphoto = C('uploadphoto', control);
var C = require("../common/index")
  , User = C.model('User')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , fs = require('fs')
  , gm = require('gm')
  , async = require('async')
  , _ = C._
  , config = process.appConfig
  
var control = {};

function uploadPhoto(req, res) {
	return {
		// 判断图片是否已存在
		// 不存在时进入下一步，直接返回图片路径
		isExist: function(cb) {
			var path = 'D:/picture/IMG_5826.JPG';
			
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
						cb(null, true);
					} else {
						//res.jsonp({error:1, photo:photo});
						cb(null, true);
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
				console.log(exif);
				if (err) {
					cb(err);
				} else{
					cb(null, true);
				}
			})
		},
		
		// 保存原始图片和缩略图
		write: function(cb) {
			var t = + new Date().getTime();
			var savePath = config.path.photo + '/' + t + '.jpg';
			var photoData = req.photoData;
			// 创建缩略图
			fs.writeFile(savePath, photoData, function(err) {
				if (err) {
					cb(err);
				} else {
					async.eachLimit(config.thumbList, 2, function(item, cb2) {
						gm(photoData)
						.noProfile()
						.resize(item[0], item[1])
						.write(savePath.replace('.jpg', '_'+item[0]+'.jpg'), function (err2) {
							cb2(err2);
						});
					}, function(err3) {
						cb(err3, true);
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

			photo.save(function(err) {
				if (err) {
					cb(err);
				} else {
					cb(null, true);
				}
			});
			
		}
	}
}

// 上传图片
control.uploadPhoto = function(req, res) {
	async.series( uploadPhoto(req, res), function(err, results) {
		if (err) {
			res.jsonp({error: err});
			//res.jsonp({error:1, msg:'上传错误'});
		} else {
			res.jsonp(results);
		}
	});
}

// 更新图片信息
control.update = function(req, res) {
  res.send('update');
}

// 删除图片
control.destroy = function(req, res) {
  res.send('destroy');
}

var photos = C('photos', control);
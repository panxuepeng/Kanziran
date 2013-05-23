var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Photo = mongoose.model('Photo')
  , utils = require('../common/utils')
  , auth = require('../common/auth')
  , fs = require('fs')
  , gm = require('gm')
  , _ = require('underscore')
  , config = process.appConfig

/**
 * 判断图片是否已存在
 * 不存在时进入下一步，直接返回图片路径
 */ 
exports.isExist = function(req, res, next) {
  var path = 'D:/picture/IMGP4390.JPG';
  var fileData = fs.readFileSync(path);
  var mark = utils.md5(fileData);
  req.mark = mark;
  console.log( mark );
  req.fileData = fileData;
  
  Photo
  .find({ mark: mark})
  .exec(function (err, photo) {
    if (err) {
      res.send('isExist error.');
    //} else if ( photo ) { // photo = [] 时，这样判断会进入到这个分支，导致逻辑错误
    } else if ( _.isEmpty(photo) ) {
      next();
    } else {
      res.send(JSON.stringify(photo));
    }
  });
}

/**
 * 获取照片的元信息
 */
exports.getExif = function(req, res, next) {
  gm(req.fileData, 'a.jpg')
  .identify(function(err, exif){
    delete exif['Profile-EXIF']['Maker Note'];
    //console.log(exif);
    req.exif = exif;
    next();
  })
}

/**
 * 保存原始图片和缩略图
 * 
 */ 
exports.saveFile = function(req, res, next) {
  var t = +new Date().getTime();
  savePath = __dirname + '/photo/' + t + '.jpg';
  fs.writeFileSync(savePath, req.fileData);
  
  // 创建第一张缩略图
  var size = config.thumbList.shift();
  gm(req.fileData, t+'.jpg')
  .noProfile()
  .resize(size[0], size[1])
  .write(savePath.replace('.jpg', '_'+size[0]+'.jpg'), function (err) {
    if (!err) {
      next();
    } else {
      res.send('saveFile error');
    }
  });
  
  // 创建后续所有缩略图
  _.each(config.thumbList, function( size ) {
    gm(req.fileData, t+'.jpg')
    .noProfile()
    .resize(size[0], size[1])
    .write(savePath.replace('.jpg', '_'+size[0]+'.jpg'), function (err) {
      if (!err) console.log('done');
    });
  });
}

/**
 * 保存到数据库
 * 
 */
exports.saveDB = function(req, res, next) {
  var photo = Photo.create(req);
  delete req.exif;
  delete req.fileData;
  
  photo.save(function(err) {
    if (err) {
      console.log(err);
      res.send('save error');
    } else {
      res.send('ok');
    }
  });
}

/**
 * 更新图片信息
 * 
 */
exports.update = function(req, res) {
  res.send('update');
}

/**
 * 删除图片
 * 
 */
exports.destroy = function(req, res) {
  res.send('destroy');
}

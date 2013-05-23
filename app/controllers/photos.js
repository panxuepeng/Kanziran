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
 * �ж�ͼƬ�Ƿ��Ѵ���
 * ������ʱ������һ����ֱ�ӷ���ͼƬ·��
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
    //} else if ( photo ) { // photo = [] ʱ�������жϻ���뵽�����֧�������߼�����
    } else if ( _.isEmpty(photo) ) {
      next();
    } else {
      res.send(JSON.stringify(photo));
    }
  });
}

/**
 * ��ȡ��Ƭ��Ԫ��Ϣ
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
 * ����ԭʼͼƬ������ͼ
 * 
 */ 
exports.saveFile = function(req, res, next) {
  var t = +new Date().getTime();
  savePath = __dirname + '/photo/' + t + '.jpg';
  fs.writeFileSync(savePath, req.fileData);
  
  // ������һ������ͼ
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
  
  // ����������������ͼ
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
 * ���浽���ݿ�
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
 * ����ͼƬ��Ϣ
 * 
 */
exports.update = function(req, res) {
  res.send('update');
}

/**
 * ɾ��ͼƬ
 * 
 */
exports.destroy = function(req, res) {
  res.send('destroy');
}

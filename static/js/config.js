define(function(require, exports, module){
  exports.base = './';
  
  // 默认首页
  exports.index = 'photo';
  
  // 公共js
  exports.commonScript = [
	'static/bootstrap/2.2.2/js/bootstrap.min.js'
  ];
  
  // 页面资源
  exports.pages = [
	'photo','photo-id','login','upload'
  ];
  
  // 页面版本号
  exports.version = {
	photo: '20121215'
  }
});

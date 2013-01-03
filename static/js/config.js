define(function(require, exports, module){
  exports.base = 'http://localhost/kanziran/';
  
  // 默认首页
  exports.index = 'index';
  
  // 公共js
  exports.commonScript = [
	'static/lib/bootstrap/2.2.2/js/bootstrap.min.js'
  ];
  
  // 页面资源
  exports.pages = [
	'index','login','upload'
  ];
  
  // 页面版本号
  exports.version = {
	index: '20121215'
  }
});

define(function(require, exports, module){
  var basePath = './';
  exports.base = basePath;
  
  // 是否登录
  exports.logined = false;
  
  // 默认首页
  exports.index = 'photolist';
  
  // 时间戳
  exports.timestamp = (+ new Date);
  
  // 公共js
  exports.commonScript = [
	'assets/bootstrap/2.2.2/js/bootstrap.min.js'
  ];
  
  // 页面资源
  exports.pages = {
	'photo':1,
	'photolist':1,
	'login':1,
	'upload':2 // 2 受保护的页面
  };
  
  // 页面版本号
  exports.version = {
	photo: '20121215'
  }
  
  exports.home = function( name ){
	return '/#/photo';
  }
  
  exports.hashLink = function( name ){
	return '/#/'+name;
  }
  
  exports.link = function( name ){
	return '/#/'+name;
  } 
  
  exports.serverLink = function( name ){
	return '/api/index.php/'+name;
  }

  
  
  exports.getTmplPath = function( name ){
	return basePath+"/tmpl/"+name+".html?"+(+new Date);
  }
  
  
  exports.getActionPath = function( name ){
	return '/assets/js/'+name+'.action.js?'+(+new Date);
  }
  
  
  
});

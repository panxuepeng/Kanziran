// 用来处理公共区域的操作，比如页头部分
define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, router = require('router');
  
  exports.checkLogin = function(result){
	var pages = Config.pages;
	if( result[0] === 200 ){
		Config.logined = true;
		
		$("#login").addClass('hidden');
		$("#logout, #upload").removeClass('hidden');
	}else{
		// 未登录状态
		
		$("#login").removeClass('hidden');
		$("#logout, #upload").addClass('hidden');
		
		// 判断当前页面是否是受保护的页面
		// 如果是则跳转到首页
		for (var name in pages ) {
			if( name === router.action && pages[name]===2 ){
				location = Config.home();
			}
		}
	}
  }
  
  
  // 页面首次加载时都会执行一次
  exports.init = function(){
	$.getJSON(Config.serverLink('login'), function( result ){
		exports.checkLogin(result);
	});
	
	$("#logout").live('click', function(){
		$.getJSON(Config.serverLink('logout'), function( result ){
			exports.checkLogin(result);
		});
		
		return false;
	});
  }
});

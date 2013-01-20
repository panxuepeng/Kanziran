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
	
	$('footer').html( getFooterHtml() );
  }
  
  function getFooterHtml(){
	var s =
'<p>&copy;2013 <a href="/?about">关于看自然</a> Powered by KanZiRan</p>'
+'<p>Thanks '
+	 	'<a href="http://twitter.github.com/bootstrap/" target="_blank" title="基于HTML，CSS，JAVASCRIPT的简洁灵活的前端框架及交互组件集">Bootstrap</a>'
+		'<a href="http://jquery.com/" target="_blank" title="一个优秀的JavaScrīpt框架。使用户能更方便地处理HTML documents、events、实现动画效果，并且方便地为网站提供AJAX交互">jQuery</a>'
+		'<a href="http://www.laravel.com/" target="_blank" title="Laravel是一款人性化的PHP Web框架，推荐！。">Laravel</a>'
+		'<a href="http://seajs.org/" target="_blank" title="SeaJS 是一个适用于 Web 端的模块加载器">SeaJS</a>'
+		'<a href="http://www.plupload.com/" target="_blank" title="一款基于 Flash、HTML5 的文件上传工具，其最大的特点是，在浏览器端压缩图片后会保留照片的Exif信息">Plupload</a>'
+		'<a href="https://github.com/aui/artTemplate" target="_blank" title="一款性能卓越的 javascript 模板引擎">artTemplate</a>'
+'</p>';
		
	return s;
  }

});

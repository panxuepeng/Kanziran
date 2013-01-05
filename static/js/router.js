/**
* hash 路由
* http://kanziran.com/#!/login
* http://kanziran.com/#!/list&k1=val&k2=val2
* http://kanziran.com/#!/page/[func]/[param]
* 注意： #! 不能少
*/
define(function(require, exports, module){
  var Config = require('config');
  var $ = require('jquery');
  window.jQuery = window.jQuery || $;
  
  var Util = seajs.pluginSDK.util;
  
  var PageId = Config.index, Path=[], Params={};
  
  /**
  * 获取 http://kanziran.com/#!/path 当中 /path 部分
  * 
  */
  exports.path = function() {
	return Path;
  };
  
  /**
  * 获取 http://kanziran.com/#!/list&k1=val&k2=val2当中 val 部分
  * 
  */
  exports.param = function(key) {
	return Params[key];
  };
  
  /**
  * 获取 http://kanziran.com/#!/list&k1=val&k2=val2当中 list 部分
  * 
  */
  function getPath(path){
	if( path.substr(0, 1) === '!' ){
		path = path.slice(1);
	}
	if( path && path.substr(0, 1) === '/' ){
		path = path.slice(1);
	}
	
	return path.split('/');
  }
  
  exports.init = function( callback ) {
    var $_GET,
		part,
		version = Config.version,
		hash=location.hash.slice(1).replace('?', '&');
	//console.log(hash);
	if( hash ){
		$_GET = hash.split('&');
		Path = getPath($_GET[0]);
		PageId = Path[0] || PageId;
		if( $.inArray(PageId, Config.pages) < 0 ){
			PageId = Config.index;
		}
		
		//console.log(PageId);
		for (var i = 1, length = $_GET.length; i < length; i += 1) {
			part = $_GET[i].split('=');
			Params[ part[0] ] = part[1];
		}
	}
	
	var url = Config.base+"/static/js/"+PageId+".action.js";
	if( version[PageId] ){
		url += '?'+version[PageId];
	}
	seajs.use(url, function( action ){
		$("#container").load("tmpl/"+PageId+".html", function(){
			if( action.api ){
				$.getJSON(action.api, function(data){
					action.init(data);
				});
			}else{
				action.init();
			}
		});
	});
		
	if (typeof callback === 'function') {
		callback();
	}
  };
  
  function useAll(arr){
	fetchAll( arr, true );
  }
  
  function fetchAll(arr, isUse){
	isUse = isUse || false;
	for (var i = 0, length = arr.length; i < length; i += 1) {
		isUse ? seajs.use( arr[i] ) : Util.fetch( arr[i] );
	}
  }
  
  function useScript(arr){
	for (var i = 0, length = arr.length; i < length; i += 1) {
		$.ajax({
		  url: arr[i],
		  dataType: "script",
		  cache: "true"
		});
	}
  }
  useScript(Config.commonScript);
  
  // 初始化成功之后，加载相关资源，回调方法仅执行一次
  exports.init(function(){
	setTimeout(function(){preload()}, 500);
  });
  
  $(window).bind('hashchange', function(){
	//console.log('hashchange');
	exports.init();
  });
  
  
  // App资源预加载
  var preload = function( ){
	var url,
		pageid,
		base = Config.base,
		version = Config.version,
		pages = Config.pages;
		
	
	// 预加载页面模板
	for (var i = 0, length = pages.length; i < length; i += 1) {
		pageid = pages[i];
		if( pageid !== PageId ){
			url = base+"/tmpl/"+pageid+".html";
			if( version[pageid] ){
				url += '?'+version[pageid];
				
			}
			$.get(url);
		}
	}
  }
  
 // console.log(Path);
});
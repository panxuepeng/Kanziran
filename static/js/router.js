/**
* REST hash router
* http://kanziran.com/#/photo
* http://kanziran.com/#/photo/1
* http://kanziran.com/#/photo/1?key=value&name=value
*/
define(function(require, exports, module){
  var Config = require('config');
  var $ = require('jquery');
  window.jQuery = window.jQuery || $;
  
  var Util = seajs.pluginSDK.util;
  
  var actionName = Config.index, Path=[], Params={}, Actions={};
  
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
	
	var arr = path.split('/');
	
	if( arr[1] ){
		arr[0] += '-id';
	}
	//console.log(arr);
	return arr;
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
		actionName = Path[0];
		if( !actionName || $.inArray(actionName, Config.pages) < 0 ){
			actionName = Config.index;
		}
		
		//console.log(actionName);
		for (var i = 1, length = $_GET.length; i < length; i += 1) {
			part = $_GET[i].split('=');
			Params[ part[0] ] = part[1];
		}
	}
	
	var url = Config.base+"/static/js/"+actionName+".action.js";
	if( version[actionName] ){
		url += '?'+version[actionName];
	}
	//console.log(url);
	if( Actions[ actionName ] ){
		$("#container").children().hide();
		$("#row-"+actionName).show();
		if( Actions[ actionName ].show ) {
			Actions[ actionName ].show( Path[1] );
		}
	}else{
		$("#container").append('<div class="row" id="row-'+actionName+'"></div>');
		
		seajs.use(url, function( o ){
			$.get("tmpl/"+actionName+".html", function(tmpl){
				$("#container").children().hide();
				
				$("#row-"+actionName).append(tmpl).show();
				o.show( Path[1] );
				o.init( Path[1] );
			});
			
			Actions[ actionName ] = o;
		});
	}
	
	if (typeof callback === 'function') {
		callback();
	}
  };
  
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
		name,
		base = Config.base,
		version = Config.version,
		pages = Config.pages;
		
	
	// 预加载页面模板
	for (var i = 0, length = pages.length; i < length; i += 1) {
		name = pages[i];
		if( name !== actionName ){
			url = base+"/tmpl/"+name+".html";
			if( version[name] ){
				url += '?'+version[name];
				
			}
			$.get(url);
		}
	}
  }
 
});
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
  * 获取 http://kanziran.com/#!/list?k1=val&k2=val2当中 list 部分
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
  
  function getAction(){
    var $_GET,
		part,
		action,
		hash=location.hash.slice(1).replace('?', '&');
	//console.log(hash);
	if( hash ){
		$_GET = hash.split('&');
		Path = getPath($_GET[0]);
		action = Path[0];
		
		//console.log(action);
		for (var i = 1, length = $_GET.length; i < length; i += 1) {
			part = $_GET[i].split('=');
			Params[ part[0] ] = part[1];
		}
	}
	
	// 如当前请求的action为空或者不在指定列表当中，则使用默认action
	if( !action || !Config.pages[action] ){
		action = Config.index;
	}	
	
	actionName = action;
	exports.action = actionName;
	return action;
  }
  
  // 页面初始化，页面首次加载后和hashchange时执行
  exports.init = function( callback ) {
	var v = Config.version
		, action = getAction();
	
	var url = Config.getActionPath(action);
	if( v[action] ){
		url += '?'+v[action];
	}
	//console.log(url);
	if( Actions[ action ] ){
		$("#container").children().hide();
		$("#row-"+action).show();
		if( Actions[ action ].show ) {
			Actions[ action ].show( Path[1] );
		}
	}else{
		$("#container").append('<div class="row" id="row-'+action+'"></div>');
		
		seajs.use(url, function( o ){
			$.get(Config.getTmplPath(o.tmpl||action), function(tmpl){
				$("#container").children().hide();
				
				$("#row-"+action).append(tmpl).show();
				if(o.show) {
					o.show( Path[1] );
				}
				if(o.init) {
					o.init( Path[1] );
				}
			});
			
			Actions[ action ] = o;
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
	var v = Config.version
		, url = Config.getActionPath("common");
	if( v['common'] ){
		url += '?'+v['common'];
	}
	
	seajs.use(url, function( o ){
		o.init();
	});
	
	setTimeout(function(){preload()}, 500);
  });
  
  $(window).bind('hashchange', function(){
	exports.init();
  });
  
  
  // App资源预加载，在初始化之后执行一次
  var preload = function( ){
	var url,
		base = Config.base,
		version = Config.version,
		pages = Config.pages;
		
	// 预加载页面模板
	for (var name in pages ) {
		if( name !== actionName ){
			url = Config.getTmplPath(name);
			if( version[name] ){
				url += '?'+version[name];
			}
			$.get(url);
		}
	}
  }
 
});
define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, common = require('common')
	, template = require('artTemplate');
  
  exports.show = function( id ){
	
	$.getJSON(Config.serverLink('photo/'+id), function(data){
		var html = template.render('tmpl-photo-id', data);
		$("#photo-id").html( html );
	});
  }
  
  exports.init = function( id ){
	// init ...
	common.lazyload();
  }
  
  
});

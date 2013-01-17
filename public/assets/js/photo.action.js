define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, template = require('artTemplate');
  
  exports.show = function( ){
	$.getJSON(Config.serverLink('photo'), function(data){
		var html = template.render('tmpl-photo', data);
		$("#photo").html( html );
	});
  }
  
  exports.init = function( ){
	// init ...
	
  }
  
});

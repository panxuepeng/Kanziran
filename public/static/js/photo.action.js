define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  exports.api = '/api/photo';
  
  exports.show = function( ){
	$.getJSON('/api/photo', function(data){
		var html = template.render('tmpl-photo', data);
		$("#photo").html( html );
	});
  }
  
  exports.init = function( ){
	// init ...
	
  }
  
});

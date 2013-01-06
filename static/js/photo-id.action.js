define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  
  exports.show = function( id ){
	$.getJSON('/api/photo.php', function(data){
		var html = template.render('tmpl-photo-id', data);
		$("#photo-id").html( html );
	});
  }
  
  exports.init = function( id ){
	// init ...
	
  }
  
  
});

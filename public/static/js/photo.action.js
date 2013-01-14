define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  exports.api = '/api/index.php/photo';
  
  exports.show = function( ){
	$.getJSON('/api/index.php/photo', function(data){
		var html = template.render('tmpl-photo', data);
		$("#photo").html( html );
	});
  }
  
  exports.init = function( ){
	// init ...
	
  }
  
});

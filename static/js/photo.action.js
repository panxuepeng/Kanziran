define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  
  exports.show = function( ){
	$.getJSON('/api/tmp.php', function(data){
		var html = template.render('tmpl-photo', {list: data.photoList});
		$("#photo").html( html );
	});
  }
  
  exports.init = function( ){
	// init ...
	
  }
  
});

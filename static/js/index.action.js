define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  
  exports.init = function(){
	$("#container").load("tmpl/index.html", function(){
		$.getJSON('/api/', function(data){
			var html = template.render('photo-list', {list: data.photoList});
			$("#row-index .span9").html( html );
		});
	});
  }
});

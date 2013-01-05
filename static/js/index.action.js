define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  
  exports.init = function(){
	$("#container").load("tmpl/index.html", function(){
		$.getJSON('/api/tmp.php', function(data){
			var html = template.render('tmpl-photo-list', {list: data.photoList});
			$("#index-photo-list").html( html );
		});
	});
  }
});

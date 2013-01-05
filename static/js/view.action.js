define(function(require, exports, module){
  var $ = require('jquery');
  
  var template = require('artTemplate');
  
  exports.api = '/api/photo.php';
  
  exports.init = function(data){
	var html = template.render('photo-view', data);
	$("#row-view .span9").html( html );
  }
});

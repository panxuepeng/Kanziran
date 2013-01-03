define(function(require, exports, module){
  var $ = require('jquery');
  
  exports.init = function(){
	$("#container").load("tmpl/login.html");
  }
});

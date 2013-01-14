define(function(require, exports, module){
  var $ = require('jquery');
  
  exports.show = function(){
	
  }
  
  exports.init = function(){
	$('form[name=login]').live('submit', function(){
		var form = $(this);
		
		$.post(form.attr('action'), form.serialize(), function( result ){
			if( result[0] === 0 ){
				location = '/';
			}else{
				alert(result[1]);
			}
		}, 'json').error(function(xhr, status){
			alert(status);
		});
		
		return false;
	});
  }
});

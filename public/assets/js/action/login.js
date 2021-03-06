define(function(require, exports, module){
  var $ = require('jquery'),
	md5 = require('md5'),
	Config = require('config'),
	common = require('./common');
  
  exports.show = function(){
	
  }
  
  exports.init = function(){
	$('form[name=login]').on('submit', function() {
		var form = $(this),
			data,
			password = form.find(':password[name=password]'),
			pwd = password.val();
			
		password.val( md5(pwd) );
		data = form.serialize();
		password.val( pwd );
		
		$.post(Config.serverLink('login'), data, function( result ){
			if( result[0] === 200 ){
				location = Config.home();
				common.checkLogin(result);
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

define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, common = require('common')
	, template = require('artTemplate');
  
  exports.show = function( id ){
	id = id || 1;
	$.getJSON(Config.serverLink('photo/'+id), function(data){
		var html = template.render('tmpl-photoview', data);
		$("#photoview").html( html );
	});
	$("#player").addClass('hide');
  }
  
  exports.init = function( id ){
	// init ...
	common.lazyload();
  }
  
  $(document).on('mousewheel', '#player-overlay,#player-prev, #player-next, #player-desc', function(){
	return false;
  });
  
  $(document).on('click', '#player-close', function(){
	//$('body').css('overflow', 'visible');
	$("#player").addClass('hide');
  });
  
  $(document).on('click', 'img[name=photoview]', function(){
	var src = $(this).attr('src').replace('/270/', '/970/');
	$("#player .photo").css('background-image', 'url('+src+')');
	$("#player").removeClass('hide');
	
	//$('body').css('overflow', 'hidden');
  });
  
});

define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, common = require('./common')
	, photoPlayer = null
	, template = require('artTemplate')
	, currentTopicid = 0;
  
  require.async('../photoplayer/'+Config.player, function( player ) {
    photoPlayer = player;
	player.init();
  });
  
  exports.show = function( id ){
	id = id || 1;
	currentTopicid = id;
	
	if( Config.cache.topic[id] ) {
		initData(Config.cache.topic[id]);
	} else {
		$.getJSON(Config.serverLink('photo/'+id), function(data){
			initData(data);
			Config.cache.topic[currentTopicid] = data;
		});
	}
	
	photoPlayer.close();
  }
  
  exports.init = function( id ){
	// init ...
	
	$(document).on('click', '.topic_edit', function(){
		location = '/#/post/'+currentTopicid;
	});
	common.lazyload();
  }

  // 编辑图片描述
  $(document).on('click', 'button[name=photo-edit]', function(){
	var html = template.render('tmpl-photo-edit', getEditTmplData($(this)));
	common.dialog({
		title: '编辑照片描述',
		width: 600,
		content: html,
		onshown: function( dialog ){
			var o = dialog.find('textarea');
			if( !$.trim(o.val()) ) o.focus();
		},
		onok: function( dialog ){
			postPhotoDesc( dialog );
		}
		
	});
  });
  
  function initData(data){
  		var html = '';
		if( data && typeof data=== 'object' && data.list ) {
			html = template.render('tmpl-photoview', data);
			
			// 是否是作者
			if( data.isauthor ) {
				// 显示编辑按钮
				$(document).on('mouseover.photo', '.photo', function(){
					$(this).find('.photo_edit').show();
				}).on('mouseleave.photo', '.photo', function(){
					$(this).find('.photo_edit').hide();
				});
			} else {
				$(document).off('mouseover.photo').off('mouseout.photo');
			}
		}
		
		$("#photoview").html( html );
  }
  
  function getEditTmplData( btn ){
	var	img = btn.closest('.photo').find('img'),
		src = img.attr('src'),
		photoid = img.attr('photoid'),
		description = img.attr('description');
		
	return {
		photosrc: src,
		topicid: currentTopicid,
		photoid: photoid,
		description: description	
	}
  }
  
  function postPhotoDesc( dialog ){
	var data = dialog.find('form').serialize();
	$.post(Config.serverLink('photo/edit'), data, function( result ){
		if( result[0] === 200 ){
			var photoid = dialog.find(":hidden[name=photoid]").val();
			$("img[photoid="+photoid+"]").attr('description', dialog.find('textarea').val());
			common.dialog.close();
		}else{
			alert(result[1]);
		}
	}, 'json').error(function(xhr, status){
		alert(status);
	});
  }
  
});

define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, common = require('./common')
	, photoPlayer = null
	, template = require('artTemplate')
	, currentTopicid = 0
	, dom = $(document);
  
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
  }
  
  exports.init = function( id ){
	// init ...
	
	dom.on('click', '[name=photo-edit]', function(){
		location = '/#/post/'+currentTopicid;
	});
	
	// [显示/隐藏]编辑按钮
	dom.on('mouseover.photo', '.thumbnail', function(){
		$(this).find('.photo_edit').show();
	}).on('mouseleave.photo', '.thumbnail', function(){
		$(this).find('.photo_edit').hide();
	})
	
	// 删除照片
	dom.on('click.photo', '[name="photo-remove"]', function(){
		if( confirm('确认彻底删除此照片吗？') ){
			var o = $(this);
			o.closest('li[id^=photo]').hide();
			
			remove( 'remove-photo', o.attr('photoid') );
		}
	}).on('click.photo', '[name="photo-unlink"]', function(){
		if( confirm('确认移除此照片吗？') ){
			var o = $(this);
			o.closest('li[id^=photo]').hide();
			
			remove( 'unlink-photo', o.attr('photoid') );
		}
	});
	
	// 删除主题
	dom.on('click.topic-remove', '[name="topic-remove"]', function(){
		if( confirm('确认删除此主题和其所有照片吗？') ){
			var o = $(this);
			
			remove( 'remove-topic' );
			Config.go( Config.home() );
		}
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
		}
		
		$("#photoview").html( html );
  }
  
  function getEditTmplData( btn ){
	var	img = btn.closest('.thumbnail').find('img'),
		src = img.attr('src'),
		photoid = img.attr('photoid'),
		shooting_time = img.attr('shooting_time'),
		description = img.attr('description');
		
	return {
		photosrc: src,
		topicid: currentTopicid,
		photoid: photoid,
		shooting_time: shooting_time,
		description: description	
	}
  }
  
  // 提交照片描述
  function postPhotoDesc( dialog ){
	var data = dialog.find('form').serialize();
	$.post(Config.serverLink('photo/edit'), data, function( result ){
		if( result[0] === 200 ){
			var photoid = dialog.find(":hidden[name=photoid]").val();
			var description = dialog.find('textarea').val();
			// 将编辑后的描述信息，写到照片属性上
			$("img[photoid="+photoid+"]").attr('description', description);
			
			$("#description-"+photoid).text(description);
			
			// 关闭窗口
			common.dialog.close();
		}else{
			alert(result[1]);
		}
	}, 'json').error(function(xhr, status){
		alert(status);
	});
  }

  // 删除照片/主题
  function remove( action, photoid ){
	action = action || 'remove-photo';
	photoid = photoid || 0;
	var data = {action: action, topicid: currentTopicid, photoid: photoid};
	$.post(Config.serverLink('photo/remove'), data, function( result ){
		if( result[0] === 200 ){
			
		}else{
			$("#photo-"+photoid).show();
		}
	}, 'json').error(function(xhr, status){
		alert(status);
		$("#photo-"+photoid).show();
	});
  }
});

define(function(require, exports, module){
  var $ = require('jquery')
	, Config = require('config')
	, common = require('./common')
	, template = require('artTemplate')
	, photoCache = {}
	, currentIndex = 0
	, currentTopicid = 0
	, ismoving = 0 // 是否正在移动
	, current;
  
  exports.show = function( id ){
	id = id || 1;
	currentTopicid = id;
	
	if(Config.cache.topic[id]) {
		initData(Config.cache.topic[id]);
	} else {
		$.getJSON(Config.serverLink('photo/'+id), function(data){
			initData(data);
		});
	}
	$("#player").addClass('hide');
  }
  
  function initData(data){
  		var html = '';
		if( data && typeof data=== 'object' && data.list ) {
			html = template.render('tmpl-photoview', data);
			
			// 是否是作者
			if( data.isauthor ) {
				// 显示编辑按钮
				$(document).on('mouseover.photo', '.photo', function(){
					$(this).find('.photo_edit').fadeIn(200);
				}).on('mouseleave.photo', '.photo', function(){
					$(this).find('.photo_edit').hide();
				});
			} else {
				$(document).off('mouseover.photo').off('mouseout.photo');
			}
			
			Config.cache.topic[currentTopicid] = data;
		}
		
		$("#photoview").html( html );
  }
  
  exports.init = function( id ){
	// init ...
	$("#player .photo").height( $(window).height() - 20 );
	
	$(document).on('click', '.topic_edit', function(){
		location = '/#/upload/'+currentTopicid;
	});
	common.lazyload();
  }
  
  $(window).resize(function(){
	
  });
  
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
  
  // 编辑图片描述
  $(document).on('click', '.photo_edit', function(){
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
  
  // 关闭大图
  $(document).on('click', '#player-close', function(){
	$('body').css('overflow', 'visible');
	$("#player").addClass('hide');
	current = null;
	$(document).off('mousewheel.bigphoto');
	$("#player .photo").stop().stop().stop();
  });
  
  // 上一张
  $(document).on('click', '#player-prev', function(){
	$("#player .photo").stop().stop().stop();
	currentIndex -= 1;
	play( currentIndex );
  });
  
  // 下一张
  $(document).on('click', '#player-next', function(){
	$("#player .photo").stop().stop().stop();
	currentIndex += 1;
	play( currentIndex );
  });
  
  // 点击小图，打开大图
  $(document).on('click', 'img[name=photoview]', function(){
	currentIndex = parseInt($(this).attr('index'), 10);
	$('body').css({'overflow': 'hidden'});
	setTimeout(function(){
		play( currentIndex );
	}, 0);
  });
  
  // 点击页面停止图片自动滚动
  $(document).on('click', '#player', function(){
	$("#player .photo").stop().stop().stop();
  });
  
  // 打开大图
  function play( index ) {
	var src = $('#photo-'+index).attr('src').replace('/270/', '/970/');
	var o = $("#player .photo"),
		height = o.height();
		
	o.css({'background-position-y': 0});
	
	current = null;
	$("#player").removeClass('hide');
	
		
	if( photoCache[src] ){
		var _img = photoCache[src];
		$(document).on('mousewheel.bigphoto', onmousewheel);
		
		o.css('background-image', 'url('+src+')');
		if( _img.height > height + 100 ){
			ismoving = true;
			var offset = (height - _img.height)/2;
			o.animate({'background-position-y': offset}, 3000, function(){
				current = _img;
				ismoving = false;
			});
		}
	} else {
		var img = new Image();
		img.index = index;
		img.onload = function( ){
			// 图片加载完成之后，如用户没有切换其他图片，则正常显示
			if( currentIndex === img.index ){
				$(document).on('mousewheel.bigphoto', onmousewheel);
				
				o.css('background-image', 'url('+src+')');
				
				if( img.height > height + 100 ){
					var offset = (height - img.height)/2;
					ismoving = true;
					current = {height: img.height, width: img.width};
					
					o.animate({'background-position-y': offset}, 3000, function(){
						ismoving = false;
					});
				}
			}
			photoCache[src] = {height: img.height, width: img.width};
			img = null;
		}
		img.src = src;
	}
  }
  
  // 鼠标滚轮滚动时，上下滑动图像
  // backgroundPosition/backgroundPositionY 的浏览器兼容问题比较多
  // 上下滚动效果有背景偏移最好改用scrollTop
  function onmousewheel(e){
	
    if( !ismoving ) {
		//console.log(e.originalEvent.wheelDelta);
		// 向上滚动大于0
		// 向下滚动小于0
		
		var o = $("#player .photo"),
			height = o.height(),
			step = 60;
		var posy = parseInt(o.css('backgroundPositionY')||0, 10);
		// ie9下得不到正确的背景偏移（backgroundPositionY），ie7/8可以正确获取，Y?
		// 但是可以得到backgroundPosition
		if( !posy ){
		// 暂时处理ie9下得不到backgroundPositionY的问题
			posy = parseInt(o.css('backgroundPosition').split(' ')[1], 10);
		}
		//console.log(o.css('backgroundPosition'));
		if(e.originalEvent.wheelDelta > 0){
			posy -= step;
		}else{
			posy += step;
		}
		
		if( posy > height ){
			posy = height;
		}else if( posy < -current.height ){
			posy = -current.height;
		}
		
		o.css({'backgroundPositionY': posy});
	}
	
	// return false 以阻止页面滚动
	return false;
  }
  
});

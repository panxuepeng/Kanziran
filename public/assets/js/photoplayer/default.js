// 图片播放器
define(function(require, exports, module){
  var $ = require('jquery')
	, common = require('../action/common')
	, photoCache = {}
	, currentIndex = 0
	, photoCount = 0 // 照片总数
	, ismoving = 0 // 是否正在移动
	, current;

  
  exports.close = function(){
	$("#player").addClass('hide');
  }
  
  exports.init = function(){
	resize();
	  
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
		if( currentIndex<0 ){
			currentIndex = 0;
			common.dialog({
				content: '已经是第一张照片了'
			});
		}else{
			play( currentIndex );
		}
	  });
	  
	  // 下一张
	  $(document).on('click', '#player-next', function(){
		$("#player .photo").stop().stop().stop();
		currentIndex += 1;
		if( currentIndex < photoCount ){
			currentIndex = photoCount;
			play( currentIndex );
		}else{
			common.dialog({
				content: '已经是最后一张照片了'
			});
		}
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
		ismoving = false;
	  });
	  
	    
	  $(window).resize(function(){
		resize();
	  });
	  
	  photoCount = $('img[name=photoview]').size();
  }
  
  function resize(){
	$("#player .photo").height( $(window).height() - 20 );
  }
  
  // 打开大图
  function play( index ) {
	var img = $('#photo-'+index),
		src = img.attr('src').replace('/270/', '/970/');
	var o = $("#player-photo"),
		height = o.height(),
		description = img.attr('description') || '<span style="color:#eeeeef;">暂无照片描述</span>';
		
	o.css({'background-position-y': 0});
	
	current = null;
	$("#player").removeClass('hide');
	$("#player-desc").html('<h4>'+$('#topic-title').text()+'</h4>'+description);
	$("#player-shooting-time").html(img.attr('shooting_time'));
		
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
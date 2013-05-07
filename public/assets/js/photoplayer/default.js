/**
 * 图片播放器
 * ================================
 * 1.点击小图打开大图播放器
 * 2.播放页面有关闭、上一张、下一张功能
 * 3.显示主题、图片描述、照片拍摄时间
 * 4.显示大图时有半透明遮罩层
 * 5.[左右]方向键进入[上下]一张，[上下]方向键[上下]移动图片
 * 
 */
define(function(require, exports, module){
  var $ = require('jquery')
	, common = require('../action/common')
	, photoCache = {}
	, currentIndex = 0
	, photoCount = 0 // 照片总数
	, ismoving = 0 // 是否正在移动
	, dom = $(document)
	, win = $(window)
	, current;

	  // 关闭大图
	  dom.on('click', '#player-close', function(){
		$('body').css('overflow', 'visible');
		$("#player").addClass('hide');
		current = null;
		dom.off('mousewheel.bigphoto');
		$("#player .photo").stop().stop().stop();
	  });
	  
	  // 上一张
	  dom.on('click', '#player-prev', function(){
		exports.prev();
	  });
	  
	  // 下一张
	  dom.on('click', '#player-next', function(){
		exports.next();
	  });
	  
	  // 点击小图，打开大图
	  dom.on('click', 'img[name=photoview]', function(){
		currentIndex = parseInt($(this).attr('index'), 10);
		$('body').css({'overflow': 'hidden'});
		
		// 使用 setTimeout 是为了避免 body 的overflow:hidden 属性失效
		setTimeout(function(){
			play( currentIndex );
		}, 0);
	  });
	  
	  // 点击页面停止图片自动滚动
	  dom.on('click', '#player', function(){
		$("#player .photo").stop().stop().stop();
		ismoving = false;
	  });
	  
	  win.resize(function(){
		resize();
	  });
  
	win.keydown(function(event){
		var keyCode = event.keyCode;
		// LEFT 37, RIGHT 39; UP 38, DOWN 40
		switch(keyCode){
			case 37: exports.prev(); break;
			case 39: exports.next(); break;
			
			case 38: exports.up(); break;
			case 40: exports.down(); break;
			
			case 27: exports.close(); break;
		}
	});
		
  exports.close = function(){
	$("#player").addClass('hide');
  }
  
  
  exports.init = function(){
	resize();
	
	photoCount = $('img[name=photoview]').size();
  }
  
  exports.prev = function(){
		$("#player .photo").stop().stop().stop();
		currentIndex -= 1;
		if( currentIndex < 0 ){
			currentIndex = 0;
			common.dialog({
				content: '已经是第一张照片了'
			});
		}else{
			play( currentIndex );
		}
  }
  
  exports.next = function(){
		$("#player .photo").stop().stop().stop();
		currentIndex += 1;
		
		if( currentIndex < photoCount ){
			play( currentIndex );
		}else{
			common.dialog({
				content: '已经是最后一张照片了'
			});
		}
  }
  
  exports.up = function(){
	onmousewheel(10);
  }
  
  exports.down = function(){
	onmousewheel(-10);
  }
  
  function resize(){
	$("#player .photo").height( win.height() - 20 );
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
	dom.off('mousewheel.bigphoto');
	
	$("#player").removeClass('hide');
	$("#player-desc").html('<h4>'+$('#topic-title').text()+'</h4>'+description);
	$("#player-shooting-time").html(img.attr('shooting_time'));
		
	if( photoCache[src] ){
		var _img = photoCache[src];
		dom.on('mousewheel.bigphoto', function(e){
			//console.log(e.originalEvent.wheelDelta);
			// 向上滚动大于0
			// 向下滚动小于0
			onmousewheel(e.originalEvent.wheelDelta);
		});
		
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
				dom.on('mousewheel.bigphoto', function(e){
					//console.log(e.originalEvent.wheelDelta);
					// 向上滚动大于0
					// 向下滚动小于0
					onmousewheel(e.originalEvent.wheelDelta);
				});
				
				o.css('background-image', 'url('+src+')');
				
				// 当图片比较高的情况下，自动将图片滚动到中间的位置
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
  // 向上滚动大于0
  // 向下滚动小于0
  function onmousewheel(wheelDelta){
	
    if( !ismoving ) {
		
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
		if( wheelDelta > 0){
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
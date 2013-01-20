define(function(require, exports, module){
	require('plupload');
	var $ = require('jquery'),
		common = require('common'),
		Config = require('config');
	
	exports.show = function(){
		
	}
	
	exports.init = function(){
		initUploader();
		initSubmit();
	}
	
	function initSubmit(){
		$('form[name=upload]').live('submit', function(){
			var form = $(this),
				data = form.serialize();
			
			$.post(form.attr('action'), data, function( result ){
				if( result[0] === 200 ){
					
				}else{
					alert(result[1]);
				}
			}, 'json').error(function(xhr, status){
				alert(status);
			});
			
			return false;
		});
	}
	
	// 初始化上传
	function initUploader(){
		// http://www.plupload.com/plupload/docs/api/index.html
		var uploader = new plupload.Uploader({
			runtimes : 'html5,flash',
			browse_button : 'pickfiles',
			url : Config.serverLink('upload'),
			flash_swf_url : 'assets/lib/plupload/1.5.4/plupload.flash.swf',
			filters : [
				{title : "Image files", extensions : "jpg"}
			],
			max_file_size : '10mb',
			resize : {width : 1600, height : 1600, quality : 90}
		});
		
		uploader.bind('Init', function(up, params) {
			$('#filelist').html("");
		});
		
		uploader.init();
		
		uploader.bind('FilesAdded', function(up, files) {
			$('#filelist').html(' 选择了 <b>'+files.length+'</b> 张图片，正在上传第 <b id="FileUploaded">0</b> 张，进度 <b id="UploadProgress">0</b>%');
			
			// 选择照片后自动开始上传
			uploader.start();
			up.refresh();
		});
		
		// 单张照片的上传进度
		uploader.bind('UploadProgress', function(up, file) {
			$('#UploadProgress').html(file.percent);
		});
		
		// 一张照片上传成功后
		uploader.bind('FileUploaded', function(up, file, data) {
			var o = $('#FileUploaded'),
				index = parseInt(o.text(), 10)+1;
				
			o.text( index );
			
			var r = $.parseJSON(data.response);
			
			$("#upload-list").append('<div class="span2"><img src="'+r.result+'" photo_id="'+r.id+'"/></div>');
		});
		
		// 所有照片上传完成
		uploader.bind('UploadComplete', function(up, files) {
			$('#filelist').html(' 已完成上传 <b>'+files.length+'</b> 张图片');
		});
		
	}
});

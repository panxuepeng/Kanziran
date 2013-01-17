define(function(require, exports, module){
	require('plupload');
	var $ = require('jquery'),
		common = require('common'),
		Config = require('config');
	
	exports.show = function(){
		
	}
	
	exports.init = function(){
		initUploader();
	}
	
	// 初始化上传
	function initUploader(){
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
			uploader.start();
			up.refresh();
		});
		
		uploader.bind('UploadProgress', function(up, file) {
			$('#UploadProgress').html(file.percent);
		});
		
		uploader.bind('FileUploaded', function(up, file, data) {
			var o = $('#FileUploaded'), index = parseInt(o.text(), 10)+1;
			o.text( index );
		});
	}
});

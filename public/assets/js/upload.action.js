define(function(require, exports, module){
	require('plupload');
	var $ = require('jquery'),
		uploader,
		common = require('common'),
		Config = require('config');
	
	exports.show = function(){
		
	}
	
	exports.init = function(){
		if( !uploader ){
			UploadPhoto.init();
		}
		Form.init();
	}
	
	
	var Form = {
		// 初始化上传表单
		init: function() {
			var self = this;
			$('form[name=upload]').on('submit', function(){
				var form = $(this),
					data = {};
					
				if( self.check(form) ){
					data.title = $.trim(form.find(':text[name=title]').val());
					data.description = $.trim(form.find('textarea[name=description]').val());
					data.photoList = [];
					
					$('img[photo_id]').each(function(){
						data.photoList.push( $(this).attr('photo_id') );
					});
					
				
					$.post(form.attr('action'), data, function( result ){
						if( result[0] === 200 ){
							self.success(result[1].topicid);
						}else{
							self.error(result[1]);
						}
					}, 'json').error(function(xhr, status){
						alert('出现错误，请稍候再试。');
					});
				}
				return false;
			});
		},
		
		check: function(form){
			if( !$.trim(form.find(':text[name=title]').val()) ){
				alert('请输入标题');
				form.find(':text[name=title]').focus();
				return false;
			}
			return true;
		},
		
		// 提交成功
		success: function ( topicid ) {
			$('#upload-submit').attr({
				disabled: true,
				title:''
			}).text('提交成功！再次选择照片后，可以继续提交');
			
			// 将返回的主题id赋值到表单项上
			// 再次提交将自动转为修改
			$('form[name=upload]').find('input[name=topicid]').val(topicid);
			
			var $success = $('#upload-success');
			$success.find('a[name=view]').attr('href', '#/photo/'+topicid);
			$success.show();
		},
		
		error: function( info ){
			if( typeof info === 'string' ){
				common.alert('<p>'+info+'</p>');
			}else if(typeof info === 'object'){
				
			}
		
		},
		
		// 继续上传
		reset: function() {
			$('form[name=upload]')[0].reset();
			$('#filelist').empty();
			$('#upload-list').empty();
			uploader.splice(0, uploader.files.length);
			$('#upload-submit').attr({
				disabled: true,
				title:'请选择照片……'
			}).text('提 交');
			$('#upload-success').hide();
		}
	};
	
	// 重置上传表单
	$('button[name=upload-reset]').on('click', function(){
		Form.reset();
		return false;
	});
	
	
	var UploadPhoto = {
		// 初始化上传
		init: function () {
			var self = this;
			
			// http://www.plupload.com/plupload/docs/api/index.html
			uploader = new plupload.Uploader({
				runtimes : 'html5,flash',
				browse_button : 'pickfiles',
				url : Config.serverLink('upload'),
				flash_swf_url : 'assets/plupload/1.5.5/plupload.flash.swf',
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
				self.selected(files);
				
				// 选择照片后自动开始上传
				uploader.start();
				up.refresh();
			});
			
			// 单张照片的上传进度
			uploader.bind('UploadProgress', function(up, file) {
				self.progress(file);
			});
			
			// 一张照片上传成功
			uploader.bind('FileUploaded', function(up, file, data) {
				self.uploadedOne(file, data);
			});
			
			// 所有照片上传完成事件
			uploader.bind('UploadComplete', function(up, files) {
				self.complete(files);
			});
			
		},
		
		selected: function( files ){
			$('#upload-success').hide();
			$('#upload-submit').attr({
				disabled: true,
				title:'',
			}).text('正在上传图片，暂时不能提交');
			
			$('#filelist').html(' 选择了 <b>'+files.length+'</b> 张图片，正在上传第 <b id="FileUploaded">0</b> 张，进度 <b id="UploadProgress">0</b>%');
		},
		
		// 上传进度
		progress: function(file){
			$('#UploadProgress').html(file.percent);
		},
		
		// 一张照片上传成功后
		uploadedOne: function(file, data){
			var o = $('#FileUploaded'),
				index = parseInt(o.text(), 10)+1;
				
			o.text( index );
			var r = $.parseJSON(data.response);
			$("#upload-list").append('<div class="span2"><img src="'+r.result+'" photo_id="'+r.id+'"/></div>');
		},
		
		// 所有照片上传完成
		complete: function(files){
			$('#filelist').html(' 已上传 <b>'+files.length+'</b> 张图片');
			
			$('#upload-submit').attr({
				disabled: false,
				title:''
			}).text(' 提 交 ');
		}
	};
	
});

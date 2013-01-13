define(function(require, exports, module){
	require('plupload');
	var $ = require('jquery');
	
	exports.show = function(){
		
	}
	exports.init = function(){
		initUploader();
	}

	function initUploader(){
		var uploader = new plupload.Uploader({
			runtimes : 'html5,flash',
			browse_button : 'pickfiles',
			max_file_size : '10mb',
			url : 'upload.php',
			flash_swf_url : 'static/lib/plupload/1.5.4/plupload.flash.swf',
			filters : [
				{title : "Image files", extensions : "jpg"}
			],
			resize : {width : 2000, height : 2000, quality : 90}
		});
		
		uploader.bind('Init', function(up, params) {
			$('#filelist').html("");
		});

		$('#uploadfiles').live('click', function(e) {
			uploader.start();
			e.preventDefault();
		});

		uploader.init();

		uploader.bind('FilesAdded', function(up, files) {
			$.each(files, function(i, file) {
				$('#filelist').append(
					'<div id="' + file.id + '">' +
					file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
				'</div>');
			});

			up.refresh(); // Reposition Flash/Silverlight
		});

		uploader.bind('UploadProgress', function(up, file) {
			$('#' + file.id + " b").html(file.percent + "%");
		});

		uploader.bind('Error', function(up, err) {
			$('#filelist').append("<div>Error: " + err.code +
				", Message: " + err.message +
				(err.file ? ", File: " + err.file.name : "") +
				"</div>"
			);

			up.refresh(); // Reposition Flash/Silverlight
		});

		uploader.bind('FileUploaded', function(up, file, data) {
			console.log(data.response);
			$('#' + file.id + " b").html("100%");
		});
	}
});

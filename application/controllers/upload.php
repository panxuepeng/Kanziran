<?php
// 注意：
// PHP文件不能带BOM头，否则返回的数据在chrome下不能正确解析json，
// 而firefox可以正确解析带bom头的服务端返回的json字符串

// 图片上传处理，每次提交仅接受一张图片，
// 如有多个图片需要上传，请多次上传。

class Upload_Controller extends Base_Controller {
	private	$app_photo;
	private	$t;
	private	$Ym;
	private $ds;
	private $rand;
	private $exif;
	private $user;
	
	public function __construct(){
		$this->filter('before', 'auth')->only(array('index'));
		
		$this->app_photo = path('app_photo');
		$t = time();
		$this->t = $t;
		$this->ds = DIRECTORY_SEPARATOR;
		$this->Ym = date('Y/m', $t);
		
		// 随机码的最大取值不能超过65535，因字段类型是smallint
		$this->rand = mt_rand(1000, 9999);
	}
		
	/**
	 * 上传一张照片
	 *
	 */
	public function action_index() {
		$this->nocache();
		@set_time_limit(300);
		$photoPath = $this->upload();
		$mark = md5(file_get_contents($photoPath));
		$user = Auth::user();
		$this->user = $user;
		
		// 根据 mark值 判断图片是否已经上传过
		// 已上传过的图片直接返回
		$photo = Photo::where_mark($mark)->first();
		if( $photo ){
			Log::info("photo_id={$photo->id} 被 {$user->username}(user_id={$user->id}) 重复上传");
			
			return json_encode(array(
				'result' => $this->time2url($photo),
				'id' => $photo->id,
			));
		}
		
		$newPath = $this->resizeImage($photoPath);
		
		if( is_file($newPath) ){
			// 缩略图压缩成功，保存数据库
			$this->exif = ExifReader::get($photoPath);
			$photoid = $this->save( $photoPath, $mark );
			
			if( $photoid ){
				return json_encode(array(
					'result' => $this->getUrl($newPath),
					'id' => $photoid,
				));
			} else {
				Log::error("Failed to save $photoPath");
				return '{"jsonrpc" : "2.0", "error" : {"code": 110, "message": "Failed to save."}}';
			}
		} else {
			// 缩略图处理失败
			Log::error("Failed to resizeImage $photoPath");
		}
	}
	
	// 根据图片的创建时间取到它的url
	private function time2url( $photo ){
		$random = $photo->random;
		$t = $photo->created_at;
		$t = str_replace('-', '/', $t);
		$t = str_replace(array(' ', ':'), '', $t);
		$url = "/photo/270/$t$random.jpg";
		
		return $url;
	}
	
	// 禁止浏览器缓存
	private function nocache() {
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		header("Cache-Control: no-store, no-cache, must-revalidate");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	}
	
	// 根据服务器存储路径转为url
	private function getUrl( $path ) {
		$path = str_replace('\\', '/', $path);
		$url = explode('public', $path);
		return str_replace(array('/original/', '/870/'), '/270/', $url[1]);
	}
	
	// 保存图片信息到数据库
	private function save( $photoPath, $mark ) {
		$t = $this->t;
		$user = $this->user;
		$photoid = 0;
		
		// 插入记录
		$photo = Photo::create(array(
			'user_id' => $user->id,
			'created_at' => date('Y-m-d H:i:s', $t),
			'updated_at' => date('Y-m-d H:i:s', $t),
			'mark' => $mark,
			'random' => $this->rand,
			'status' => -1,
		));
		
		if( $photo ){
			$photoid = $photo->id;
			$this->saveExif( $photoid );
		}
		
		return $photoid;
	}
	
	
	// 保存图片的exif信息
	private function saveExif( $photoid ) {
		$filename = isset($_REQUEST["name"]) ? $_REQUEST["name"] : '';
		// Clean the filename for security reasons
		$filename = preg_replace('/[^\w\._]+/', '_', $filename);
		$exif = $this->exif;
		
		Exif::create(array(
			'photo_id' => $photoid,
			// mysql timestamp 类型字段不能使用int型的值插入
			'shooting_time' => $exif['datetime'],
			'make' => $exif['make'],
			'model' => $exif['model'],
			'shot' => $exif['shot'],
			'filename' => $filename,
			'filesize' => $exif['filesize'],
		));
	}
	
	// 生成缩略图
	private function resizeImage($photoPath) {
		if( class_exists('Gmagick') ) {
			$newPath = $this->useGmagick($photoPath);
			
			Log::info("Gmagick resizeImage: $photoPath");
			
		} else {
			Bundle::start('resizer');
			$ds = $this->ds;
			$_870 = str_replace("{$ds}original{$ds}", $ds.'870'.$ds, $photoPath);
			$_270 = str_replace("{$ds}original{$ds}", $ds.'270'.$ds, $photoPath);
			$this->mkdir('870');
			$this->mkdir('270');
			$img = Resizer::open( $photoPath );
			$img->resize( 870 , 1160 )->save( $_870 , 90 );
			$img->resize( 270 , 360 )->save( $_270 , 90 );
			//$img->resize( 270 , 202 ,'crop')->save( $_270 , 90 ); //'crop'裁切，固定宽高
			$img->close();
			
			$newPath = $_270;
			Log::info("GD resizeImage: $photoPath");
		}
		
		return $newPath;
	}
	
	
	private function useGmagick($photoPath) {
		$ds = $this->ds;
		// GMagick
		$sizes = array(array(870, 1160), array(270, 360));
		$gm = new Gmagick($photoPath);
		$gm->setImageFormat('JPEG');
		$gm->stripImage();
		$gm->setCompressionQuality(80);
		
		foreach( $sizes as $wh ){
			$this->mkdir($wh[0]);
			
			$imgw = $gm->getImageWidth();
			$imgh = $gm->getImageHeight();
			if($imgw > $wh[0] || $imgh > $wh[1]){
				//if( $wh[0] > 600 ){
					$gm->resizeImage($wh[0], $wh[1], Gmagick::FILTER_CATROM, 1, true);
				//}else{
				//	$gm->cropThumbnailImage($wh[0], $wh[1]);
				//}
			}
			
			//提高图片质量
			//$gm->enhanceimage();
			$to = str_replace("{$ds}original{$ds}", "$ds{$wh[0]}$ds", $photoPath);
			$gm->write($to);
		}
		
		$gm->clear();
		$gm->destroy();
		
		return $photoPath;
	}
	
	// 生成新的图片文件路径
	private function newPhotoPath( $dir ){
		$ds = $this->ds;
		$filename = date('dHis', $this->t).$this->rand.'.jpg';
		
		$filePath = preg_replace('/[\\\\\/]+/', $ds, "$dir$ds$filename");
		
		return $filePath;
	}
	
	// 创建目录
	private function mkdir($name){
		$photoDir = $this->app_photo;
		$ds = $this->ds;
		$Ym = $this->Ym;
		
		$dir = "$photoDir$ds$name$ds$Ym";
		!is_dir($dir) && File::mkdir($dir, 0777) && touch($dir."{$ds}index.html");
		return $dir;
	}
	
	// 返回值：照片的保存路径
	private function upload() {
		// Settings
		$targetDir = $this->mkdir('original');
		
		$cleanupTargetDir = true; // Remove old files
		$maxFileAge = 5 * 3600; // Temp file age in seconds

		// Uncomment this one to fake upload time
		// usleep(5000);

		// Get parameters
		$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
		$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
		$filePath = $this->newPhotoPath($targetDir);

		// Remove old temp files	
		if ($cleanupTargetDir && is_dir($targetDir) && ($dir = opendir($targetDir))) {
			while (($file = readdir($dir)) !== false) {
				$tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;

				// Remove temp file if it is older than the max age and is not the current file
				if (preg_match('/\.part$/', $file) && (filemtime($tmpfilePath) < $this->t - $maxFileAge) && ($tmpfilePath != "{$filePath}.part")) {
					@unlink($tmpfilePath);
				}
			}
			closedir($dir);
		} else{
			Log::error("Failed to open $targetDir");
			die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}}');
		}

		// Look for the content type header
		if (isset($_SERVER["HTTP_CONTENT_TYPE"]))
			$contentType = $_SERVER["HTTP_CONTENT_TYPE"];

		if (isset($_SERVER["CONTENT_TYPE"]))
			$contentType = $_SERVER["CONTENT_TYPE"];

		// Handle non multipart uploads older WebKit versions didn't support multipart in HTML5
		if ( !empty($contentType) && strpos($contentType, "multipart") !== false) {
			if (isset($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
				// Open temp file
				$out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
				if ($out) {
					// Read binary input stream and append it to temp file
					$in = fopen($_FILES['file']['tmp_name'], "rb");

					if ($in) {
						while ($buff = fread($in, 4096))
							fwrite($out, $buff);
					} else
						die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}}');
					fclose($in);
					fclose($out);
					@unlink($_FILES['file']['tmp_name']);
				} else
					die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}}');
			} else
				die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}}');
		} else {
			// Open temp file
			$out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
			if ($out) {
				// Read binary input stream and append it to temp file
				$in = fopen("php://input", "rb");

				if ($in) {
					while ($buff = fread($in, 4096))
						fwrite($out, $buff);
				} else
					die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}}');

				fclose($in);
				fclose($out);
			} else
				die('{"jsonrpc":"2.0","error":{"code":102,"message":"Failed to open output stream."}}');
		}

		// Check if file has been uploaded
		if (!$chunks || $chunk == $chunks - 1) {
			// Strip the temp .part suffix off 
			rename("{$filePath}.part", $filePath);
		}

		return $filePath ;
	}
	
	
	/**
	 * 显示服务端api帮助信息
	 *
	 */
	public function action_help() {
		
	}
}

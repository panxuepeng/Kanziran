<?php

class Upload {
	private $mark;
	private $datetime;
	private $ds;
	private $thumbList; // 缩略图列表
	private $preview; // 上传时预览的图片尺寸
	
	public function __construct( ){
		$this->datetime = date('Y-m-d H:i:s', time());
		$this->ds = DIRECTORY_SEPARATOR;
		
		$this->preview = 270;
		$this->thumbList = array(array(970, 2080), array(270, 480));
		//$this->thumbList = array(array(1170, 2080), array(270, 480));
	}
	
	// 禁止浏览器缓存
	public static function nocache() {
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		header("Cache-Control: no-store, no-cache, must-revalidate");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	}
	
	// 根据服务器存储路径转为url
	public function getUrl( $path ) {
		$path = str_replace('\\', '/', $path);
		$url = explode('public', $path);
		return preg_replace('/photo\/[\w]+\//', "photo/{$this->preview}/", $url[1]);
	}
	
	// 保存图片信息到数据库
	public function save($userid, $shooting_time) {
		// 插入记录
		$photoid = DB::table('photos')->insert_get_id(array(
			'user_id' => $userid,
			'created_at' => $this->datetime,
			'mark' => $this->mark,
			// mysql timestamp 类型字段不能使用int型的值插入
			'shooting_time' => $shooting_time,
			'status' => 1,
		));
		
		return $photoid;
	}
	
	
	// 保存图片的 exif 信息
	public function saveExif( $photoid, $exif ) {
		$filename = isset($_REQUEST["name"]) ? $_REQUEST["name"] : '';
		// Clean the filename for security reasons
		$filename = preg_replace('/[^\w\._]+/', '_', $filename);
		$date = $this->datetime;
		
		$exifid = DB::table('exifs')->insert_get_id(array(
			'photo_id' => $photoid,
			'camera_make_id' => $this->name2id('camera_makes', $exif['make'], $date),
			'camera_model_id' => $this->name2id('camera_models', $exif['model'], $date),
			'camera_shot_id' => $this->name2id('camera_shots', $exif['shot'], $date),
			'filename' => $filename,
			'filesize' => $exif['filesize'],
		));
		
		return $exifid;
	}
	
	// 针对 camera_makes camera_models camera_shots 表
	// 根据 name 获取对应的 id
	private function name2id( $table, $name, $created_at ){
		$id = 0;
		$name = trim($name);
		if( $name ){
			$row = DB::table($table)->where_name($name)->first();
			if( $row ){
				$id = $row->id;
			}else{
				$id = DB::table($table)->insert_get_id(array(
					'name' => $name,
					'created_at' => $created_at,
				));
			}
		}
		return $id;
	}
	
	// 生成缩略图
	public function resizeImage($photoPath) {
		if( class_exists('Gmagick') ) {
			$newPath = $this->useGmagick($photoPath);
			Log::info("Gmagick resizeImage: $photoPath");
		} else {
			Log::info("GD resizeImage: $photoPath");
			
			Bundle::start('resizer');
			$ds = $this->ds;
			
			$img = Resizer::open( $photoPath );
			foreach( $this->thumbList as $wh ){
				$newPath = $photoPath;
				$newPath = str_replace("{$ds}photo{$ds}", "{$ds}public{$ds}photo$ds{$wh[0]}$ds", $newPath);
				File::mkdir(dirname($newPath));
				
				// 如果是宽大于高，则采用剪取方式，否则按宽度定比缩略
				// 以确保缩略图在高度上不会留白，否则如16:9等的图片高度就不够了
				// 'crop'裁切，固定宽高
				//$option = ( $img->width > $img->height ) ? 'crop': 'auto';
				//$img->resize( $wh[0], $wh[1], $option );
				
				if( $wh[0] <= 120 ){
					$img->resize( $wh[0], $wh[1], 'crop' );
				}elseif( $img->width > $img->height ){
					$img->resize($wh[0], $wh[0]*0.75, 'crop');
				}else{
					$img->resize($wh[0], $wh[1], 'auto');
				}
				$img->save( $newPath , 80 );
			}
			$img->close();
		}
		
		return $newPath;
	}
	
	
	private function useGmagick($photoPath) {
		$ds = $this->ds;
		// GMagick
		$gm = new Gmagick($photoPath);
		$gm->setImageFormat('JPEG');
		$gm->stripImage();
		$gm->setCompressionQuality(80);
		
		foreach( $this->thumbList as $wh ){
			$imgw = $gm->getImageWidth();
			$imgh = $gm->getImageHeight();
			if($imgw > $wh[0] || $imgh > $wh[1]){
				if( $wh[0] <= 120 ){
					$gm->cropThumbnailImage($wh[0], $wh[1]);
				} else {
				
					if( $imgw > $imgh ){
						// cropThumbnailImage 方法在生成大图时，可以自动剪取
						// 但是图像颗粒感比较明显
						// $gm->cropThumbnailImage($wh[0], $wh[0]*0.75);
						
						// 如果图片是 16:9 的宽图，则剪取中间部分生成 4:3 比例的图片
						$newWidth = round($imgh/3*4); // 计算出来4:3的宽度
						$x = round(( $imgw - $newWidth )/2);
						$y = 0;
						$gm->cropImage($newWidth, $imgh, $x, $y);
					}
					
					$gm->resizeImage($wh[0], $wh[1], Gmagick::FILTER_CATROM, 1, true);
				}
			}
			
			// 提高图片质量，对于有噪点的图像以提高图像的质量
			// 可能不太明显
			$gm->enhanceimage();
			$newPath = $photoPath;
			$newPath = str_replace("{$ds}photo{$ds}", "{$ds}public{$ds}photo$ds{$wh[0]}$ds", $newPath);
			File::mkdir(dirname($newPath));
			$gm->write($newPath);
		}
		
		$gm->clear();
		$gm->destroy();
		
		return $newPath;
	}
	
	// 生成新的图片文件路径
	public function newPhotoPath( $dir ){
		$ds = $this->ds;
		$filePath = preg_replace('/[\\\\\/]+/', $ds, "$dir$ds{$this->mark}.jpg");
		return $filePath;
	}
	
	/**
	 * 接收客户端上传的照片
	 * 1、禁止上传重复的照片（通过查数据库mark值实现）
	 * 2、禁止上传不是相机拍摄的照片（可以做到吗？）
	 * 3、禁止上传小于 300k 的照片
	 * 
	 * @param  string  $tempfile 照片的临时上传路径
	 * 
	 * @return boolean 是否保存成功
	 */
	public function receive( $tempfile ) {
		// 默认用不到chunk，分块上传时才会用到
		$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
		$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
		$contentType = '';
		// Look for the content type header
		if (isset($_SERVER["HTTP_CONTENT_TYPE"]))
			$contentType = $_SERVER["HTTP_CONTENT_TYPE"];

		if (isset($_SERVER["CONTENT_TYPE"]))
			$contentType = $_SERVER["CONTENT_TYPE"];

		// Handle non multipart uploads older WebKit versions didn't support multipart in HTML5
		if ( !empty($contentType) && strpos($contentType, "multipart") !== false) {
			if (isset($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
				Log::info("uploaded_file: ".$_FILES['file']['tmp_name']);
				// Open temp file
				$out = fopen($tempfile, $chunk == 0 ? "wb" : "ab");
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
			$out = fopen($tempfile, $chunk == 0 ? "wb" : "ab");
			if ($out) {
				Log::info('php://input');
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
			$this->mark = md5(file_get_contents($tempfile));
		}

		return $this->mark;
	}
}
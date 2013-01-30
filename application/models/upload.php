<?php

class Upload {
	private $mark;
	private $datetime;
	private $ds;
	private $thumbList; // ����ͼ�б�
	private $preview; // �ϴ�ʱԤ����ͼƬ�ߴ�
	
	public function __construct( ){
		$this->datetime = date('Y-m-d H:i:s', time());
		$this->ds = DIRECTORY_SEPARATOR;
		
		$this->preview = 170;
		$this->thumbList = array(array(1366, 1050), array(770, 1050), array(170, 227));
	}
	
	// ��ֹ���������
	public static function nocache() {
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
		header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
		header("Cache-Control: no-store, no-cache, must-revalidate");
		header("Cache-Control: post-check=0, pre-check=0", false);
		header("Pragma: no-cache");
	}
	
	// ���ݷ������洢·��תΪurl
	public function getUrl( $path ) {
		$path = str_replace('\\', '/', $path);
		$url = explode('public', $path);
		return preg_replace('/photo\/[\w]+\//', "photo/{$this->preview}/", $url[1]);
	}
	
	// ����ͼƬ��Ϣ�����ݿ�
	public function save($userid, $shooting_time) {
		// �����¼
		$photoid = DB::table('photos')->insert_get_id(array(
			'user_id' => $userid,
			'created_at' => $this->datetime,
			'mark' => $this->mark,
			// mysql timestamp �����ֶβ���ʹ��int�͵�ֵ����
			'shooting_time' => $shooting_time,
			'status' => 1,
		));
		
		return $photoid;
	}
	
	
	// ����ͼƬ�� exif ��Ϣ
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
	
	// ��� camera_makes camera_models camera_shots ��
	// ���� name ��ȡ��Ӧ�� id
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
	
	// ��������ͼ
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
				$newPath = str_replace('storage', 'public', $newPath);
				$newPath = str_replace("{$ds}photo{$ds}", "{$ds}photo$ds{$wh[0]}$ds", $newPath);
				File::mkdir(dirname($newPath));
				$img->resize( $wh[0], $wh[1] )->save( $newPath , 90 );
				//$img->resize( 270 , 202 ,'crop')->save( $_270 , 90 ); //'crop'���У��̶����
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
				//if( $wh[0] > 600 ){
					$gm->resizeImage($wh[0], $wh[1], Gmagick::FILTER_CATROM, 1, true);
				//}else{
				//	$gm->cropThumbnailImage($wh[0], $wh[1]);
				//}
			}
			
			//���ͼƬ����
			//$gm->enhanceimage();
			$newPath = $photoPath;
			$newPath = str_replace('storage', 'public', $newPath);
			$newPath = str_replace("{$ds}photo{$ds}", "{$ds}photo$ds{$wh[0]}$ds", $newPath);
			File::mkdir(dirname($newPath));
			$gm->write($newPath);
		}
		
		$gm->clear();
		$gm->destroy();
		
		return $newPath;
	}
	
	// �����µ�ͼƬ�ļ�·��
	public function newPhotoPath( $dir ){
		$ds = $this->ds;
		$filePath = preg_replace('/[\\\\\/]+/', $ds, "$dir$ds{$this->mark}.jpg");
		return $filePath;
	}
	
	/**
	 * ���տͻ����ϴ�����Ƭ
	 * 
	 * @param  string  $tempfile ��Ƭ����ʱ�ϴ�·��
	 * 
	 * @return boolean �Ƿ񱣴�ɹ�
	 */
	public function receive( $tempfile ) {
		// Ĭ���ò���chunk���ֿ��ϴ�ʱ�Ż��õ�
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
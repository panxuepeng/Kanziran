<?php
// 注意：
// 1、PHP文件不能带BOM头，否则返回的数据在chrome下不能正确解析json，
//    而firefox可以正确解析带bom头的服务端返回的json字符串。
// 2、图片上传处理，每次提交仅接受一张图片，
//    如有多个图片需要上传，请多次上传。

class Upload_Controller extends Base_Controller {
	private $exif;
	private $user;
	
	public function __construct(){
		$this->filter('before', 'auth')->only(array('index'));
				
		$user = Auth::user();
		$this->user = $user;
	}
		
	/**
	 * 上传一张照片
	 * 
	 * 业务逻辑：
	 * 1、接收客户端提交的图片文件
	 * 2、要判断图片是否已经存在
	 * 3、创建缩略图
	 * 4、插入到数据库
	 * 5、保存图片的exif信息
	 * 6、返回json信息给浏览器，成功时包括id、url，错误时包括error
	 */
	public function action_index() {
		Upload::nocache();
		@set_time_limit(300);
		$Ymd = date('Ym/d');
		$user = $this->user;
		$uid = $this->user->id;
		$ds = DIRECTORY_SEPARATOR;
		
		$upload = new Upload();
		
		// 原图的保存目录
		$dir = path('storage')."photo$ds$Ymd";
		!is_dir($dir) && File::mkdir($dir);
				
		// 上传成功之后返回 md5(图片二进制内容)
		// 正常情况下是一次上传完成
		$tempfile = "$dir/$uid.part";
		
		$mark = $upload->receive($tempfile);
		
		if( $mark ){
			// 根据 mark值 判断图片是否已经上传过
			// 已上传过的图片直接返回结果，并且删除刚刚上传时创建的临时文件
			$photo = Photo::where_mark($mark)->first();
			if( $photo ){
				$isok = File::delete($tempfile)? '成功':'失败';
				Log::info("photo_id={$photo->id} 被 {$user->username}(user_id={$user->id}) 重复上传，临时文件删除$isok");
				$url = Photo::url($photo);
				
				return json_encode(array(
					'result' => $url,
					'id' => $photo->id,
				));
			}
		
			// 原图的保存路径
			$photofile = $upload->newPhotoPath($dir);
			if ( rename($tempfile, $photofile) ){
				Log::info("rename success: $tempfile to $photofile ");
			}else{
				Log::error("rename error: $tempfile to $photofile ");
			}
		} else {
			// 没有上传成功，或是分块上传尚未完成
			return '';
		}
		
		// 生成缩略图
		$newPath = $upload->resizeImage($photofile);
		
		if( is_file($newPath) ){
		// 缩略图压缩成功，插入数据库
			$exif = ExifReader::get($photofile);
			$photoid = $upload->save( $uid, $exif['datetime'] );
			
			if( $photoid ){
				$exifid = $upload->saveExif( $photoid, $exif );
				if( !$exifid ){
					Log::error("Failed to exif $photofile , photo_id=$photoid");
				}
				return json_encode(array(
					'result' => $upload->getUrl($newPath),
					'id' => $photoid,
				));
			} else {
				Log::error("Failed to save $photofile");
				return '{"jsonrpc" : "2.0", "error" : {"code": 110, "message": "Failed to save."}}';
			}
		} else {
		// 缩略图处理失败
			Log::error("Failed to resizeImage $photofile");
		}
	}
	
	/**
	 * 显示服务端api帮助信息
	 *
	 */
	public function action_help() {
		
	}
}

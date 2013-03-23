<?php

class Photo extends Eloquent {
	// 必须禁止 laravel 自动更新时间字段
	 public static $timestamps = false;

	// 根据图片的创建时间取到它的url
	// 默认返回小图的url
	public static function url( $photo, $size=270 ){
		$created_at = $photo->created_at;
		$ym_d = substr($created_at, 0, 4).substr($created_at, 5, 2).'/'.substr($created_at, 8, 2);
		$url = "/photo/$size/$ym_d/{$photo->mark}.jpg";
		
		return $url;
	}
	
	// 根据图片Id删除图片数据
	// 同时删除相关文件
	 public static function deleteById( $photoid ){
		return $affected = DB::table('photos')
		->where('id', '=', $photoid)
		->update(array('updated_at' => date('Y-m-d H:i:s'), 'status' => 0));
	 }
	 
	 // 删除图片文件
	 public static function deleteFile($photoid){
		$photo = DB::table('photos')->where_id($photoid)->first();
		$path270 = 'public/'.self::url( $photo );
		$path970 = str_replace('/270/', '/970/', $path270);
		$path = str_replace(array('/270/', 'public/'), '', $path270);
		
		return unlink($path270) && unlink($path970) && unlink($path);
	 }
}
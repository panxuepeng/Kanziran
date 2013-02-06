<?php

class Photo extends Eloquent {
	// 必须禁止 laravel 自动更新时间字段
	 public static $timestamps = false;

	// 根据图片的创建时间取到它的url
	public static function url( $photo, $size=270 ){
		$created_at = $photo->created_at;
		$ym_d = substr($created_at, 0, 4).substr($created_at, 5, 2).'/'.substr($created_at, 8, 2);
		$url = "/photo/$size/$ym_d/{$photo->mark}.jpg";
		
		return $url;
	}
}
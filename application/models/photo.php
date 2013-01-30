<?php

class Photo extends Eloquent {
	// �����ֹ laravel �Զ�����ʱ���ֶ�
	 public static $timestamps = false;

	// ����ͼƬ�Ĵ���ʱ��ȡ������url
	public static function url( $photo, $size=170 ){
		$created_at = $photo->created_at;
		$ym_d = substr($created_at, 0, 4).substr($created_at, 5, 2).'/'.substr($created_at, 8, 2);
		$url = "/photo/$size/$ym_d/{$photo->mark}.jpg";
		
		return $url;
	}
}
<?php

class Topicphoto extends Eloquent {
	// 必须禁止 laravel 自动更新时间字段
	 public static $timestamps = false;
	 public static $table = 'topic_photos';
	 
	 // 根据主题id获取一张照片
	 public static function getFirstPhoto( $topicid ){
		$photos = self::getPhotos( $topicid, $limit=1 );
		$row = null;
		if( !empty($photos) ){
			$row = $photos[0];
		}
		return $row;
	 }
	 
	 // 根据主题id获取所属照片
	 public static function getPhotos( $topicid, $limit=100 ){
		return (array)DB::table('topic_photos')
			->left_join('photos', 'topic_photos.photo_id', '=', 'photos.id')
			->where('topic_photos.topic_id', '=', $topicid)
			->where('photos.status', '=', 1)
			->order_by('topic_photos.status', 'desc')
			->order_by('topic_photos.display_order', 'asc')
			->take($limit)
			->get(array('topic_photos.description', 'photos.created_at', 'photos.mark', 'photos.shooting_time'));
	 }
	 
	 // 根据主题id获取关系
	 public static function getByTopicid( $topicid ){
		return (array)DB::table('topic_photos')
			->where('topic_id', '=', $topicid)
			->get();
	 }
	 
	 // 更新主题对应的照片关系表
	 public static function updatePhotoList( $topicid, $photoList ) {
		$datetime = date('Y-m-d H:i:s');
		// 查询已经存在的主题和照片的关系
		$topic_photos = self::getByTopicid($topicid);
		
		// 过滤掉已经存在的关系
		foreach( $topic_photos as $i => $row ){
			if( in_array($row->photo_id, $photoList) ){
				unset( $photoList[array_search($row->photo_id, $photoList)] );
			}
		}
		
		if( empty($photoList) ){
		// 没有新的关系，不需要更改
			Log::info('没有新的主题照片关系，不需要更新 topic_photos 表');
			$result = true;
		} else {
			// 根据 topicid 将每一个photoid和topicid插入到 topic_photos 表，生成主题和图片关系
			$display_order = 0;
			$sql = 'INSERT INTO topic_photos(topic_id, photo_id, display_order, updated_at, status) VALUES';
			$values = array();
			foreach( $photoList as $photoid ){
				$display_order+=1;
				$values[] = "($topicid, $photoid, $display_order, '$datetime', 1)";
			}
			
			$sql .= implode(',', $values);
			
			Log::info($sql);
			$result = DB::query($sql);
		}
		return $result;
	 }
	 
}
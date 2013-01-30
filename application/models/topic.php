<?php

class Topic extends Eloquent {
     public static $timestamps = true;
	 
	 // 根据主题id获取主题信息
	 public static function getById( $topicid ){
		return DB::table('topics')
			->left_join('users', 'topics.user_id', '=', 'users.id')
			->where('topics.id', '=', $topicid)
			->where('topics.status', '=', 1)
			->order_by('topics.weight', 'desc')
			->order_by('topics.updated_at', 'desc')
			->first(array('topics.id', 'topics.title', 'topics.updated_at', 'topics.photo_count', 'topics.description', 'users.username as author'));
	 }
	 
	 // 获取主题列表和其封面照片
	 public static function getList( $offset=0, $limit=20){
		$result = DB::table('topics')
			->left_join('photos', 'photos.id', '=', 'topics.cover_photo')
			->left_join('topic_photos', 'topic_photos.photo_id', '=', 'topics.cover_photo')
			->left_join('users', 'topics.user_id', '=', 'users.id')
			->where('topics.status', '=', 1)
			->order_by('topics.weight', 'desc')
			->order_by('topics.updated_at', 'desc')
			->skip($offset)
			->take($limit)
			->get(array('topics.id', 'topics.title', 'topics.updated_at', 'topics.photo_count', 'topics.description', 'topic_photos.description as photo_desc', 'photos.mark', 'photos.created_at', 'photos.shooting_time', 'users.username as author'));
		
		return (array)$result;
	 }
}
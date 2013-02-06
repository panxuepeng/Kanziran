<?php

class Photolist_Controller extends Base_Controller {
	/**
	 * 照片列表
	 * 没有设置封面照片的需要拿一张普通照片
	 */
	public function action_index( $pn=1 ) {
		$pagesize = 12;
		$topics = Topic::getList(($pn-1) * $pagesize, $pagesize);
		
		$result = array();
		foreach( $topics as $topic ) {
			if( empty($topic->mark) ){
				$photo = Topicphoto::getFirstPhoto($topic->id);
				if( $photo ){
					$topic->mark = $photo->mark;
					$topic->created_at = $photo->created_at;
					$topic->shooting_time = $photo->shooting_time;
				}
			}
			
			$result[] = array(
				'topicid'=> $topic->id,
				'title'=>$topic->title,
				'photo'=>Photo::url($topic),
				'author'=>$topic->author,
				'updated_at'=>$topic->updated_at,
				'photo_count'=>$topic->photo_count,
				'description'=>$topic->description,
			);
		}
		
		$topicCount = Topic::where('status', '=', 1)->count();
		$pageCount = floor($topicCount/$pagesize);
		
		return json_encode(array(
			'list'=>$result,
			'topicCount'=>$topicCount,
			'pageCount'=>$pageCount
		));
	}
	
}
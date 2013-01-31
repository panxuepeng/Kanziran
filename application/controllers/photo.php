<?php

class Photo_Controller extends Base_Controller {
	private $user;
	
	public function __construct(){
		$this->filter('before', 'auth|validator')->only(array('add', 'edit'));
		$user = Auth::user();
		$this->user = $user;
	}
	
	/**
	 * 浏览照片主题
	 * 
	 */
	public function action_index( $topicid=0 ) {
		$result = 404;
		
		// 获取主题信息
		$topic = Topic::getById($topicid);
		if( $topic ){
			$result = array(
				'topicid'=> $topic->id,
				'title'=>$topic->title,
				'author'=>$topic->author,
				'updated_at'=>$topic->updated_at,
				'photo_count'=>$topic->photo_count,
				'description'=>$topic->description,
				'list'=>array(),
			);
			
			// 获取所属照片
			$photos = Topicphoto::getPhotos( $topicid );
			
			foreach( $photos as $row ) {
				$result['list'][] = array(
					'photo'=> Photo::url($row, 770),
					'description'=> $row->description,
					'shooting_time'=> $row->shooting_time,
				);
			}
		}
		return json_encode($result);
	}
	
	/**
	 * 创建/修改 照片主题
	 *
	 */
	public function action_add( ) {
		$input = Input::all();
		$topicid = Input::get('topicid', 0);
		$photoList = $input['photoList'];
		$datetime = date('Y-m-d H:i:s');
		$user = $this->user;
		$uid = $this->user->id;
		
		if( empty($photoList) ){
			return json(400, '您还没有上传任何图片');
		}else{
			Log::info('photo.add: photoList='.json_encode($photoList));
		}
		
		if( $topicid ){
			// 有photoid 时更新
			$topic = DB::table('topics')->where_id($topicid)->first();
			if( empty($topic) ){
				return json(404, '您更新的照片主题不存在');
			}
		} else {
			// 插入之前，根据uid和title验证是否已经存在
			$topic = DB::table('topics')
				->where('user_id', '=', $uid)
				->where('title', '=', $input['title'])
				->first();
		}
		
		if( $topic ){
			$topicid = $topic->id;
			// 必须是作者自己才可以更新
			if( $topic->user_id != $uid ){
				return json(401, '必须是作者自己才可以更新');
			}
			
			// 更新 topics 表的照片数字段photo_count
			$affected = DB::table('topics')
				->where('id', '=', $topicid)
				->update( array('photo_count' => count($photoList)) );
		} else {
			// 插入topics 表
			$topicid = DB::table('topics')->insert_get_id(array(
				'user_id' => $uid,
				'title' => $input['title'],
				'description' => $input['description'],
				'photo_count' => count($photoList),
				'created_at' => $datetime,
				'updated_at' => $datetime,
				'status' => 1,
			));
		}
		
		// 处理主题和图片的关系
		if( Topicphoto::updatePhotoList($topicid, $photoList) ){
			$result = json(200, array('topicid'=>$topicid));
		} else {
			$result = json(500, '照片图片关系插入失败');
			// sql 错误时会自动记录日志
		}
		
		return $result;
	}
	
	/**
	 * 1、编辑照片主题信息
	 * 2、编辑单张照片的描述信息
	 *
	 */
	public function action_edit( $topic_id=0, $photo_id=0 ) {
		echo $topic_id;
		echo $photo_id;
	}
	
	/**
	 * 显示服务端api帮助信息
	 *
	 */
	public function action_help() {
		echo 'help';
	}
	
	
}

/* End of file photo.php */

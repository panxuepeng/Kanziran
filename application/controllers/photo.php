<?php

class Photo_Controller extends Base_Controller {
	public function __construct(){
		$this->filter('before', 'auth|validator')->only(array('add', 'edit'));
	}
	/**
	 * 照片列表
	 *
	 */
	public function action_index( ) {
		//echo 'index';
		//$user = User::find(1);
		$user = User::where_username('panxuepeng')->first();
		print_r( $user );
	}

	/**
	 * 照片列表
	 *
	 */
	public function action_list( ) {
		echo 'list';
	}
	
	/**
	 * 浏览照片详情
	 * 
	 */
	public function action_view( $photo_id=0 ) {
		echo $photo_id;
		echo 'view';
	}
	
	/**
	 * 添加照片主题
	 *
	 */
	public function action_add( ) {
		$input = Input::all();
		
		$rules = include(path('app').'formrules/photo_add.php');
		$validation = Validator::make($input, $rules);

		if ($validation->fails())
		{
			return print_r($validation->errors->messages, true);
		}
		
		echo 'add.';
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

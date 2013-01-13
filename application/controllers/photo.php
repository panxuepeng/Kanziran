<?php

class Photo_Controller extends Base_Controller {
	public function __construct(){
		$this->filter('before', 'auth|validator')->only(array('add', 'edit'));
	}
	/**
	 * ��Ƭ�б�
	 *
	 */
	public function action_index( ) {
		//echo 'index';
		//$user = User::find(1);
		$user = User::where_username('panxuepeng')->first();
		print_r( $user );
	}

	/**
	 * ��Ƭ�б�
	 *
	 */
	public function action_list( ) {
		echo 'list';
	}
	
	/**
	 * �����Ƭ����
	 * 
	 */
	public function action_view( $photo_id=0 ) {
		echo $photo_id;
		echo 'view';
	}
	
	/**
	 * �����Ƭ����
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
	 * 1���༭��Ƭ������Ϣ
	 * 2���༭������Ƭ��������Ϣ
	 *
	 */
	public function action_edit( $topic_id=0, $photo_id=0 ) {
		echo $topic_id;
		echo $photo_id;
	}
	
	/**
	 * ��ʾ�����api������Ϣ
	 *
	 */
	public function action_help() {
		echo 'help';
	}
	
	
}

/* End of file photo.php */

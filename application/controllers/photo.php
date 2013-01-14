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
		$photoList = array(
			array(
				'id'=>"1",
				'title'=>"春天爬泰山1",
				'author'=>"潘雪鹏",
				'date'=>"2012-04-21",
				'photo_count'=>17,
				'desc'=>"景山公园牡丹花卉艺术节，四月的景山公园正是欣赏牡丹花地时候，公园不大到处都是牡丹花。",
				'photo'=>'static/tmp/01.jpg',
				'photo_desc'=>'景山公园牡丹花卉艺术节',
			),
			array(
				'id'=>"2",
				'title'=>"春天爬泰山2",
				'author'=>"潘雪鹏",
				'date'=>"2012-04-22",
				'photo_count'=>16,
				'desc'=>"景山公园牡丹花卉艺术节，四月的景山公园正是欣赏牡丹花地时候，公园不大到处都是牡丹花，有大的，有小的，有紫色的，有粉色的，有黄色的，有白色的。",
				'photo'=>'static/tmp/02.jpg',
				'photo_desc'=>'景山公园牡丹花卉艺术节',
			),
			array(
				'id'=>"3",
				'title'=>"春天爬泰山3",
				'author'=>"潘雪鹏",
				'date'=>"2012-04-23",
				'photo_count'=>11,
				'desc'=>"牡丹花期过后还有芍药花。公园门票，在花期是10元，平时2元。 景山公园最大的特色，就是可以鸟瞰故宫",
				'photo'=>'static/tmp/03.jpg',
				'photo_desc'=>'景山公园牡丹花卉艺术节',
			),
			array(
				'id'=>"4",
				'title'=>"春天爬泰山4",
				'author'=>"潘雪鹏",
				'date'=>"2012-04-24",
				'photo_count'=>23,
				'desc'=>"公园门票，在花期是10元，平时2元。 景山公园最大的特色，就是可以鸟瞰故宫",
				'photo'=>'static/tmp/01.jpg',
				'photo_desc'=>'景山公园牡丹花卉艺术节',
			)
		);
		echo json_encode(array('list'=>$photoList));
	}
	
	/**
	 * 浏览照片详情
	 * 
	 */
	public function action_view( $photo_id=0 ) {
		$photos = array(
			'id'=>"1",
			'title'=>"浏览照片",
			'author'=>"潘雪鹏",
			'date'=>"2012-04-21",
			'photo_count'=>17,
			'desc'=>"景山公园牡丹花卉艺术节，四月的景山公园正是欣赏牡丹花地时候，公园不大到处都是牡丹花。",
			'list'=>array(
				array(
					'photo'=>"static/tmp/02.jpg",
					'photo_desc'=>"景山公园牡丹花卉艺术节，四月的景山公园正是欣赏牡丹花地时候，公园不大到处都是牡丹花。"
				)
			)
		);

		echo json_encode($photos);
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

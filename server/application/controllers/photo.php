<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Photo extends CI_Controller {

	/**
	 * 默认方法
	 *
	 */
	public function index() {
		$this->photo_list();
	}
	
	/**
	 * 照片列表
	 *
	 */
	public function photo_list() {
		
	}
	
	/**
	 * 浏览照片详情
	 *
	 */
	public function view( $photo_id=0 ) {
		echo $id;
	}
	
	/**
	 * 添加照片主题
	 *
	 */
	public function add( ) {
		
	}
	
	/**
	 * 编辑照片主题信息
	 *
	 */
	public function edit( $subject_id=0 ) {
		
	}
	
	/**
	 * 编辑单张照片的描述信息
	 *
	 */
	public function edit_photo( $photo_id=0 ) {
		
	}
	
	/**
	 * 显示服务端api帮助信息
	 *
	 */
	public function help() {
		
	}
	
	
}

/* End of file photo.php */

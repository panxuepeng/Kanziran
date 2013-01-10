<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Subject extends CI_Controller {

	/**
	 * 默认方法
	 *
	 */
	public function index() {
		$this->subject_list();
	}
	
	/**
	 * 照片列表
	 *
	 */
	public function subject_list() {
		
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
	 * 显示服务端api帮助信息
	 *
	 */
	public function help() {
		
	}
	
	
}

/* End of file subject.php */

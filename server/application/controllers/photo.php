<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Photo extends CI_Controller {

	/**
	 * Ĭ�Ϸ���
	 *
	 */
	public function index() {
		$this->photo_list();
	}
	
	/**
	 * ��Ƭ�б�
	 *
	 */
	public function photo_list() {
		
	}
	
	/**
	 * �����Ƭ����
	 *
	 */
	public function view( $photo_id=0 ) {
		echo $id;
	}
	
	/**
	 * �����Ƭ����
	 *
	 */
	public function add( ) {
		
	}
	
	/**
	 * �༭��Ƭ������Ϣ
	 *
	 */
	public function edit( $subject_id=0 ) {
		
	}
	
	/**
	 * �༭������Ƭ��������Ϣ
	 *
	 */
	public function edit_photo( $photo_id=0 ) {
		
	}
	
	/**
	 * ��ʾ�����api������Ϣ
	 *
	 */
	public function help() {
		
	}
	
	
}

/* End of file photo.php */

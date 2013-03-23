<?php

class Api_Controller extends Base_Controller {
	/**
	 * 显示服务端api帮助信息
	 *
	 */
	public function action_index() {
		$text = file_get_contents(path('docs').'server-api.md');
		
		$html = Markdown::defaultTransform($text);
		return View::make('api.index')->with('html', $html);
	}
	
}

<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
*/

function json($error_no, $msg=''){
	return json_encode(array($error_no, $msg));
}

Route::get('login', function( )
{
	if (Auth::check())
	{
		$user = Auth::user();
		return json(200, array('userid'=>$user->id, 'username'=>$user->username));
	}else{
		return json(101);
	}
});

Route::post('login', array('before' => 'validator', function( )
{
	$input = Input::all();
	$credentials = array('username' => $input['username'], 'password' => $input['password']);

	if (Auth::attempt($credentials))
	{
		return json(200, '登录成功');
	}else{
		return json(404, '登录失败，用户名或密码错误。');
	}
}));

Route::get('logout', function()
{
	Auth::logout();
	return json(0, '退出成功');
});

/*
|--------------------------------------------------------------------------
| Application Controller Routes
|--------------------------------------------------------------------------
|
| Simply tell Laravel the HTTP verbs and URIs it should respond to. It is a
| breeze to setup your application using Laravel's RESTful routing and it
| is perfectly suited for building large applications and simple APIs.
|
| Registering the "home" controller
|		
|		Route::controller('home');
|
| Register all controllers for the application
|
|		Route::controller(Controller::detect());
|
*/

Route::get('photo/(:num)', 'photo@index');
Route::post('photo', 'photo@add');
// Registering a route that points to a controller action
// Route::get('/home', 'home@index');
// Route::get('/home/demo', 'home@demo');

// Route::controller(Controller::detect());
// 尽量不使用上面的自动提取方式，效率不好
Route::controller(array('photo', 'post', 'photolist'));

/*
|--------------------------------------------------------------------------
| Application 404 & 500 Error Handlers
|--------------------------------------------------------------------------
|
| To centralize and simplify 404 handling, Laravel uses an awesome event
| system to retrieve the response. Feel free to modify this function to
| your tastes and the needs of your application.
|
| Similarly, we use an event to handle the display of 500 level errors
| within the application. These errors are fired when there is an
| uncaught exception thrown in the application.
|
*/

Event::listen('404', function()
{
	return Response::error('404');
});

Event::listen('500', function()
{
	return Response::error('500');
});

/*
|--------------------------------------------------------------------------
| Route Filters
|--------------------------------------------------------------------------
|
| Filters provide a convenient method for attaching functionality to your
| routes. The built-in before and after filters are called before and
| after every request to your application, and you may even create
| other filters that can be attached to individual routes.
|
| Let's walk through an example...
|
| First, define a filter:
|
|		Route::filter('filter', function()
|		{
|			return 'Filtered!';
|		});
|
| Next, attach the filter to a route:
|
|		Route::get('/', array('before' => 'filter', function()
|		{
|			return 'Hello World!';
|		}));
|
*/

Route::filter('before', function()
{
	//Log::write('route', URI::current());
	// Do stuff before every request to your application...
	//return '';
});

Route::filter('after', function($response)
{
	// Do stuff after every request to your application...
});

Route::filter('csrf', function()
{
	if (Request::forged()) return Response::error('500');
});

Route::filter('auth', function()
{
	if (Auth::guest()) {
		return json(500, '需要登录后操作。');
	}
});

Route::filter('validator', function()
{
	$input = Input::all();
	if(empty($input)) {
		return json(502, '缺少必要的数据');
	}
	
	$route = URI::current();
	$rulefile = path('app')."formrules/$route.php";
	
	$rules = include($rulefile);
	$validation = Validator::make($input, $rules);

	if ($validation->fails())
	{
		return json(501, $validation->errors->messages);
	}
});
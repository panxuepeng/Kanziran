<?php
// see http://www.slimframework.com/

require 'E:/GitHub/Slim/Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/', function () {
	echo 'hello';
});

$app->get('/photo', function () {
	include 'photo.php';
});

$app->get('/photo/:id', function ( $id ) {
	include 'photo-id.php';
});

// POST route
$app->post('/post', function () {
    echo 'This is a POST route';
});

// PUT route
$app->put('/put', function () {
    echo 'This is a PUT route';
});

// DELETE route
$app->delete('/delete', function () {
    echo 'This is a DELETE route';
});

$app->run();
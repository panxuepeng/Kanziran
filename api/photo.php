<?php

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
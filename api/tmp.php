<?php


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

$tags = array('植物园','香山','颐和园','故宫','北海','采摘','景山公园');

echo json_encode(array('photoList'=>$photoList, 'tags'=>$tags));
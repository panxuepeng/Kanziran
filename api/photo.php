<?php

$photos = array(
	array(
	'img'=>"static/tmp/02.jpg",
	'desc'=>"景山公园牡丹花卉艺术节，四月的景山公园正是欣赏牡丹花地时候，公园不大到处都是牡丹花。"
	)
);

echo json_encode(array('photos'=>$photos));
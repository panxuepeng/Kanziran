<?php
/*
$filename = 'E:\GitHub\Kanziran\public\photo\original\2013\01\2015221327145.jpg';
$info = exif_read_data($filename, 0, true);

print_r($info);

*/

$a = '/photo/original/2013/01/2015221327145.jpg';
$preview = 270;
echo preg_replace('/photo\/[\w]+\//', "photo/$preview/", $a);

<?php
/*
 批量压缩一个目录下的图片到960×800尺寸
*/
set_time_limit(120);
header('Content-Type: text/html; charset=gbk');

if( !isset($_GET['width']) ){
	exit('enter width like ?width=270');
}
$width=$_GET['width'];

$dir = "E:\\GitHub\\Kanziran\\photo";

while (($file = readdir($dh)) !== false) {
	if( isImageFile($file) ){
		$image = $dir . $file;
		echo "<br>$image";
		flush();
		ob_flush();
		$name = getNewName( $image );
		if( is_file($name) ){
			echo " exist.";
		}else{
			echo " thumb.";
			thumb( $image, $name);
		}
	}
}
closedir($dh);
echo '<br>OK;';



function isImageFile($file){
	return 'jpg' === strtolower(substr($file, -3));
}

function getNewName( $image ){
	$name = str_replace('picture', 'photo', $image);
	
	return $name;
}

function thumb( $image, $out ){
	$w = 960;
	$h = 800;
	$im = new Gmagick($image);
	$im->setImageFormat('JPEG');
	$im->stripImage();
	$im->setCompressionQuality(80);
	$im->resizeImage($w, $h, Gmagick::FILTER_CATROM, 1, true);
	$im->write( $out );
	$im->clear();
	$im->destroy();
}
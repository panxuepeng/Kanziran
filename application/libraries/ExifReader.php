<?php

class ExifReader {
  public static function get($imagefile) {
    $info = array(
		'timestamp'=>'',
		'datetime'=>'',
		'FileSize'=>0, //单位b
		'filesize'=>0, //单位k
		'make'=>'',
		'model'=>'',
		'shot'=>'',
		'gps'=>'',
	);
	
    $data = exif_read_data($imagefile, 'IDF0,THUMBNAIL', true);
    if ($data === false)
      return $info;
	  
	
    // the date and time the image was taken
    if (isset($data['IFD0']['DateTime'])) {
      $info['timestamp'] = strtotime($data['IFD0']['DateTime']);
      $info['datetime'] = $data['IFD0']['DateTime'];
    }
    else if (isset($data['EXIF']['DateTimeOriginal'])) {
      $info['timestamp'] = strtotime($data['EXIF']['DateTimeOriginal']);
      $info['datetime'] = $data['EXIF']['DateTimeOriginal'];
    }
    else if (isset($data['EXIF']['DateTimeDigitized'])) {
      $info['timestamp'] = strtotime($data['EXIF']['DateTimeDigitized']);
      $info['datetime'] = $data['EXIF']['DateTimeDigitized'];
    }
	
	// Make
    if (isset($data['IFD0']['Make']))
      $info['make'] = trim($data['IFD0']['Make']);
	
	// FileSize
    if (isset($data['FILE']['FileSize'])) {
      $info['FileSize'] = trim($data['FILE']['FileSize']);
      $info['filesize'] = round($info['FileSize'] / 1024, 2);
	}
	
	// Model
    if (isset($data['IFD0']['Model']))
      $info['model'] = trim($data['IFD0']['Model']);
	  
	// GPS
    if (isset($data['GPS']))
      $info['gps'] = $data['GPS'];
	
	// 获取镜头参数
	if (isset($data['MAKERNOTE'])) {
		foreach($data['MAKERNOTE'] as $key => $value) {
			if( strstr($key, ':0x0095') !== false ) {
				$info['shot'] = $value;
			}
		}
	}
	
    return $info;
  }
}
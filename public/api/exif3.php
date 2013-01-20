<?php
$filename = 'E:\GitHub\Kanziran\public\photo\original\2013\01\1921124778886.jpg';
$exif = new ImageMetadataParser($filename);
print_r($exif->parseExif());

/*
 * This file is a part of the Image Metadata Parser Library.
 *
 * (c) 2013 Hauke Schade.
 *
 * For the full copyright and license information, please view the license.txt
 * file that was distributed with this source code.
 */

class ImageMetadataParser {

  protected $sFilename;

  protected $aAttributes = array();

  public function __construct($sFilename) {
    $this->sFilename = $sFilename;
  }
  
  public static function exifAvailable() {
    $load_ext = get_loaded_extensions();
    return in_array(exif, $load_ext);
  }

  public function parseExif() {
    $aArr = exif_read_data($this->sFilename, 'IDF0,THUMBNAIL', true);
    if ($aArr === false)
      return false;

    // the date and time the image was taken
    if (isset($aArr['IFD0']['DateTime'])) {
      $this->aAttributes['timestamp'] = self::timestampFromEXIF($aArr['IFD0']['DateTime']);
      $this->aAttributes['datetime'] = $aArr['IFD0']['DateTime'];
    }
    else if (isset($aArr['EXIF']['DateTimeOriginal'])) {
      $this->aAttributes['timestamp'] = self::timestampFromEXIF($aArr['EXIF']['DateTimeOriginal']);
      $this->aAttributes['datetime'] = $aArr['EXIF']['DateTimeOriginal'];
    }
    else if (isset($aArr['EXIF']['DateTimeDigitized'])) {
      $this->aAttributes['timestamp'] = self::timestampFromEXIF($aArr['EXIF']['DateTimeDigitized']);
      $this->aAttributes['datetime'] = $aArr['EXIF']['DateTimeDigitized'];
    }
	
    // the images title
    if (isset($aArr['COMPUTED']['UserComment']))
      $this->aAttributes['title'] = trim($aArr['COMPUTED']['UserComment']);

    if (isset($aArr['GPS']))
      $this->aAttributes['gps'] = $aArr['GPS'];

    return $this->aAttributes;
  }

  private function timestampFromEXIF( $string ) {
    if ( ! ( preg_match('/\d\d\d\d:\d\d:\d\d \d\d:\d\d:\d\d/', $string))) {
      // wrong date
      return false;
    }

    $iTimestamp = mktime(
            substr( $string, 11, 2 ), 
            substr( $string, 14, 2 ), 
            substr( $string, 17, 2 ), 
            substr( $string, 5, 2 ), 
            substr( $string, 8, 2 ), 
            substr( $string, 0, 4 ));

    return $iTimestamp;
  }

  public function get() {
    return ($this->aAttributes);
  }
}
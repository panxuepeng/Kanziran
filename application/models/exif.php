<?php

class Exif extends Eloquent {
	// 如果不希望在插入记录时自动添加`updated_at`, `created_at`字段，
	// 必须将timestamps指定为false
	public static $timestamps = false;
	
}
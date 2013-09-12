/**
 * 照片 Collection 
 * 检查日期: 2013-09-10
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  
/*
String
Number
Boolean | Bool
Array
Buffer
Date
ObjectId | Oid
Mixed
*/

var PhotoSchema = new Schema({
	user_id: ObjectId
	, created_at: {type: Date, default: Date.now}
	, updated_at: {type: Date, default: Date.now}
	, mark: { type: String, unique: true } // md5(二进制内容)
	, shooting_time: Date // 拍摄时间
	, filesize: Number // 文件大小，单位kb
	, width: Number
	, height: Number
	, status: { type: Number, default: -1 } // 状态: 0删除 -1待审 1正常
	, description: { type: String, default: '' } // 图片描述
	, exif: {
		make: String // 生成厂商
		, model: String // 型号
		, iso: String // 
		, exposure_time: String // 曝光时间
		, focal_length: String // 焦距
		, f_number: String // 焦距
		, exposure_program: String // 曝光程序
		//, shot: String // 镜头型号，貌似取不到
		, filename: String // 文件名称
	}
})

/**
 * Methods
 */
PhotoSchema.methods = {

}

PhotoSchema.statics = {
	/**
	* 焦距：
	*   < 20mm 超广角镜头
	*   24mm - 35mm 广角镜头
	*   50mm 标准镜头
	*   80mm - 300mm 长焦镜头
	*   > 300mm 超长焦镜头
	*/
	// 构建一个Photo实例
	create: function(data) {
	var exif = data.exif['Profile-EXIF'];
	var dt = exif['Date Time'].split(' ');
	dt[0] = dt[0].replace(':', '/').replace(':', '/');
	var Photo = mongoose.model('Photo');

	var photo = new Photo({
		user_id: data.uid
		, mark: data.photoMd5
		, shooting_time: new Date(dt.join(' ')) // 拍摄时间
		, filesize: Math.round(data.photoData.length/1024) // 文件大小，单位k
		, width: data.exif['size'].width
		, height: data.exif['size'].height
		, exif: {
			make: exif.Make // 生成厂商
			, model: exif.Model // 型号
			, iso: exif['ISO Speed Ratings'] // iso
			, exposure_time: exif['Exposure Time'] // 曝光时间
			, focal_length: exif['Focal Length'] // 焦距
			, f_number: exif['F Number'] // 焦距
			, exposure_program: exif['Exposure Program'] // 曝光程序
			, shot: 'm' // 镜头型号
			, filename: data.exif['path'] // 文件名称
		}
	});

	return photo;
	}
}

mongoose.model('Photo', PhotoSchema)



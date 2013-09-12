/**
 * 主题 Collection 
 * 检查日期: 2013-09-10
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId

var TopicSchema = new Schema({
    user_id: ObjectId
  , title: String
  , description: String
  , photo_count: { type: Number, default: 0 }
  , created_at: {type: Date, default: Date.now}
  , updated_at: {type: Date, default: Date.now}
  , cover_photo: { type: ObjectId, default: null } // 封面照片
  , visit_count: { type: Number, default: 0 } // 浏览数
  , weight: { type: Number, default: 1 } // 权重[0-65535]
  , status: { type: Number, default: -1 } // 状态: 0删除 -1待审 1正常
  
  // photos: [ photo_id, ... ]
  , photos: Array
  
  // photos_des: {photo_id: description}
  , photos_des: Array
})

/**
 * Methods
 */
TopicSchema.methods = {

}

TopicSchema.statics = {

}

mongoose.model('Topic', TopicSchema)

/*
Topic所有方法：
	base
	modelName
	model
	db
	a
	schema
	options
	collection
	setMaxListeners
	emit
	addListener
	on
	once
	removeListener
	removeAllListeners
	listeners
	init
	ensureIndexes
	remove
	find
	_applyNamedScope
	findById
	findOne
	count
	distinct
	where
	$where
	findOneAndUpdate
	findByIdAndUpdate
	findOneAndRemove
	findByIdAndRemove
	create
	update
	mapReduce
	aggregate
	populate
	_getSchema
	compile
	__subclass
*/
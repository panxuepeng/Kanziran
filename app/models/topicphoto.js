/**
 * 主题和图片关系 Colletion
 * 检查日期: 2013-09-10
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId


var TopicphotoSchema = new Schema({
    topic_id: { type: ObjectId}
  , photo_id: { type: ObjectId}
  , display_order: { type: Number, default: 1 } // 显示顺序
  , updated_at: {type: Date, default: Date.now}
  , description: String // 图片描述
  , status: { type: Number, default: -1 } // 状态: 0删除 -1待审 1正常
})

/**
 * Methods
 */
TopicphotoSchema.methods = {

}

mongoose.model('Topicphoto', TopicphotoSchema)

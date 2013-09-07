/**
 * 
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , ObjectId = Schema.ObjectId

var TopicSchema = new Schema({
    user_id: ObjectId
  , title: String
  , description: String
  , photo_count: { type: Number, default: 0 }
  , created_at: {type: Date, default: Date.now}
  , updated_at: {type: Date, default: Date.now}
  , cover_photo: { type: ObjectId, default: null } // ������Ƭ
  , visit_count: { type: Number, default: 0 } // �����
  , weight: { type: Number, default: 1 } // Ȩ��[0-65535]
  , status: { type: Number, default: -1 } // ״̬: 0ɾ�� -1���� 1����
  , photos: { type: [ObjectId] } // ͼƬ
})

/**
 * Methods
 */

TopicSchema.methods = {

}

mongoose.model('Topic', TopicSchema)

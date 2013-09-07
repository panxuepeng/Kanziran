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
  , cover_photo: { type: ObjectId, default: null } // ·âÃæÕÕÆ¬
  , visit_count: { type: Number, default: 0 } // ä¯ÀÀÊý
  , weight: { type: Number, default: 1 } // È¨ÖØ[0-65535]
  , status: { type: Number, default: -1 } // ×´Ì¬: 0É¾³ý -1´ýÉó 1Õý³£
  , photos: { type: [ObjectId] } // Í¼Æ¬
})

/**
 * Methods
 */

TopicSchema.methods = {

}

mongoose.model('Topic', TopicSchema)

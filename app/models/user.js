/**
 * 
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')

var UserSchema = new Schema({
    username: { type: String, unique: true }
  , password: String
  // role: 0��ͨ�û� 1��������Ա 2����Ա 5��������Ա 8ϵͳ����Ա
  , role: { type: Number, default: 0 }
  , created_at: {type : Date, default: Date.now}
  , updated_at: {type : Date, default: Date.now}
  // ״̬: 0ɾ�� -1���� 1����
  , status: { type: Number, default: 1 }
})

/**
 * Methods
 */
UserSchema.methods = {


}

mongoose.model('User', UserSchema)

/**
 * 用户 Collection 
 * 检查日期: 2013-09-10
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
    username: { type: String, unique: true }
  , password: String
  // role: 0普通用户 1待审拍摄员 2拍摄员 5免审拍摄员 8系统管理员
  , role: { type: Number, default: 0 }
  , created_at: {type : Date, default: Date.now}
  , updated_at: {type : Date, default: Date.now}
  // 状态: 0删除 -1待审 1正常
  , status: { type: Number, default: 1 }
})

/**
 * Methods
 */
UserSchema.methods = {


}

mongoose.model('User', UserSchema)

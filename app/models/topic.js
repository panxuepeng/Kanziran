
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: String
  , email: String
  , username: String
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
  })
  .get(function() { return this._password })


// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')


/**
 * Methods
 */

UserSchema.methods = {


}

mongoose.model('User', UserSchema)

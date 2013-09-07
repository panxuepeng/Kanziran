var mongoose = require('mongoose')
  , utils = require('./utils')
  , auth = require('./auth')
  , Controller = require('./controller')
  
Controller.utils = utils
Controller.auth = auth
Controller.model = function (name) {
	return mongoose.model(name)
}

module.exports = Controller;
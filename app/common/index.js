var mongoose = require('mongoose')
  , utils = require('./utils')
  , auth = require('./auth')
  , Controller = require('./controller')
  , config = process.appConfig
  
Controller.utils = utils
Controller.auth = auth
Controller.config = config
Controller.model = function (name) {
	return mongoose.model(name)
}

module.exports = Controller;
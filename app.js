var fs = require('fs')
  , express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./app/config/config')[env]
 
process.appConfig = config;

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
});

// express settings
require('./app/config/express')(app)

var routes = require('./app/config/routes')

routes(app);

// Start the app by listening on <port>
app.listen(config.port);
console.log('Express app started on port '+config.port);

// expose app
exports = module.exports = app;
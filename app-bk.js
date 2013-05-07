var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.bodyParser());

// 所有环境
app.set('title', 'Kanziran');

// 开发环境
if ('development' == app.get('env')) {
  app.set('db uri', '');
}

// 生产环境
if ('production' == app.get('env')) {
  app.set('db uri', '');
}

app.get(/^\/api\/index\.php\/(topics|photolist)$/i, function(req, res) {
	var topics = require('./app/controllers/topics');
	topics.get(req, res);
});

app.post('/api/index.php/upload', function(req, res) {
	var upload = require('./app/controllers/upload');
	upload.post(req, res);
});

app.get('/api/index.php/login', function(req, res) {
	res.send('[101,""]');
});

app.listen(8080);
console.log('Kanziran Server start.');
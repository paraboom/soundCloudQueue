var express = require('express'),
	http = require('http'),
	url = require('url'),
	app = express();

app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');
});

app.get('/auth', function(req, res){
	res.sendfile(__dirname + '/soundcloud_auth.html');
});

// app.get('*.js', function(req, res){
// 	console.log(req);
// 	res.sendfile(__dirname + req.url);
// });

// app.get('*.png', function(req, res){
// 	res.sendfile(__dirname + req.url);
// });

// app.get('*.css', function(req, res){
// 	res.sendfile(__dirname + req.url);
// });

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000);

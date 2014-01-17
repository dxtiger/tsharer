


var express = require('express'),
	jade = require('jade'),
	route = require('./routes'),
	app = express(),
	port = 3000,
	RedisStore = require('connect-redis')(express);
	
	
	
app.engine('jade',jade.__express);
app.set('view engine','jade');
app.set('views', __dirname + '/views'); 

//app.use(express.compress()); // gzip

app.use(express.static(__dirname + '/static')); /** 静态文件地址前缀 /public **/


/** 上传图片控件 **/
app.use(express.bodyParser({
	uploadDir:'./static/uploads',
	keepExtensions:true
}));
app.use(express.cookieParser());


app.use(express.session({
	store : new RedisStore({
		host: '127.0.0.1',
    	port: 6379,
    	db : 1
	}),
	secret: 'tiger412722'
}));


// 栏目名数组
var alltypes = require('./routes/type/type');
alltypes.all(app)
	
	
	
route(app);

app.listen(port);

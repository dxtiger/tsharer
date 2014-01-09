
var port = process.env.APP_PORT;



var express = require('express'),
	jade = require('jade'),
	route = require('./routes'),
	dev = true, 
	app = express();
	
	
	
	
app.engine('jade',jade.__express);
app.set('view engine','jade');
app.set('views', __dirname + '/views'); 

app.use(express.compress()); // gzip

app.use(express.static(__dirname + '/static')); /** 静态文件地址前缀 /public **/


/** 上传图片控件 **/


app.use(express.bodyParser({
	uploadDir:'./static/uploads',
	keepExtensions:true
}));


app.use(express.cookieParser());




if(dev) {
	port = 3000;
	var RedisStore = require('connect-redis')(express);
	
	app.use(express.session({
		store : new RedisStore({
			host: '127.0.0.1',
	    	port: 6379,
	    	db : 0
		}),
		secret: '1234567890QWERTY'
	}));
	
}else{
	var MemcacheStore = require('connect-memcache')(express);
	
	app.use(express.session({
	    secret: '1234567890QWERTY',
	    store: new MemcacheStore()
	}));
}





route(app);

app.listen(port);

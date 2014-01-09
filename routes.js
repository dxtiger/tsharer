var authentication = require('./routes/users/authentication'),
	user = {
		login : require('./routes/users/login'),
		register : require('./routes/users/register'),
		logout : require('./routes/users/logout'),
		edit : require('./routes/users/edit')
	},
	article = {
		list : require('./routes/articles/list'),
		add : require('./routes/articles/add'),
		edit : require('./routes/articles/edit'),
		info : require('./routes/articles/info'),
		del : require('./routes/articles/del'),
		upload : require('./routes/articles/upload')
	},
	comment = {
		list : require('./routes/comments/list'),
		add : require('./routes/comments/add'),
		del : require('./routes/comments/del'),
		edit : require('./routes/comments/edit')
	},
	upload = require('./routes/test/request'),
	read = require('./routes/test/write'),
	oss = require('./routes/test/oss');
	

module.exports = function(app){
	
	// authentication
	// 路径中包含 /edit , /add , /del 的请求，先验证
	app.all(/edit|add|del|upload/,function(req,res,next){
		if(req.path == '/comment/add'){
			next();
			return;
		}
		authentication(req,res,next);
	})
	
	app.get('/read',read);
	
	app.get('/oss',oss.get);
	app.post('/oss',oss.post);
	
	//app.get('/bbs',bbs);
	
	// home
	app.get('/',article.list);
	app.get('/index',article.list);
	
	
	// 文章
	// /article?start=0
	// /article?start=100&type=时尚
	// /article?start=100&user=tiger
	// /article/add
	// /article/edit/gid
	app.get('/article',article.list);
	app.get('/article/',article.list);
	
	app.get('/article/info/:gid',article.info);
	
	app.get('/article/add',article.add.get);
	app.post('/article/add',article.add.add);
	
	app.get('/article/edit/:gid',article.edit.get);
	app.post('/article/update/:gid',article.edit.update);
	
	app.get('/article/del/:gid',article.del);
	
	app.post('/article/upload',article.upload);
	
	
	
	// 评论   仅提供 ajax接口
	app.get('/comment/add',comment.add);
	app.get('/comment/del',comment.del);
	app.get('/comment/edit',comment.edit);
	app.get('/comment/list',comment.list);
	
	
	
	// 修改用户信息
	//app.param( 'type' , /\w+/ );
	app.get('/users/edit',user.edit.get);
	app.get('/users/edit/:type',user.edit.get);
	
	app.post('/users/edit/name',user.edit.name);
	app.post('/users/edit/password',user.edit.pwd);
	app.post('/users/edit/icon',user.edit.icon);
	
	
	
	// 登录
	app.get('/login',user.login.get);
	app.post('/login',user.login.post);
	
	// 注册 验证
	app.get('/register',user.register.get);
	app.post('/register',user.register.post);
	app.get('/vorify',user.register.vorify);
	
	
	// 登出
	app.get('/logout',user.logout);
	
	
	// 获取上传的文件地址。post，get，put，delete地址。
	// 用于上传图片，头像    
	app.get('/geturl',upload)
	
	
	
	// search
	
	
	
	
	// 404
	app.get('*',function(req,res){
		res.send(404)
	})
	
}








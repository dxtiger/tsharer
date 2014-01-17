var mysql = require('../mysql'),
	crypto = require('crypto'),
	uuid = require('uuid');


function md5(str){
	var hash = crypto.createHash('md5');
	hash.update(str);
	str = hash.digest('hex');
	return str;
}



function get(req,res){
	res.render('users/register',{
		message : 'null'
	});
}


// 提交
function post(req,res){
	
	var name = req.body.username,
		pwd = req.body.password,
		repwd = req.body.repassword,
		email = req.body.email,
		icon = req.body.icon,
		date = req.body.date || new Date(),
		uid = req.body.uid || uuid.v1();
	
	if(pwd != repwd) {
		res.render('users/register',{
			message : 0 //'密码两次输入的不一致,请重新输入.'
		})
		return;
	}
	
	
	if(!icon){
		icon =  '/img/icon.jpg'  // 默认头像
	}
	
	pwd = md5(pwd);
	
	vFn('email',email,function(n){
		if(n == -1){
			res.render('users/register',{
				message : 2 // 出错了，请重新试下
			})
			return;
		}
		if(n==1){
			res.render('users/register',{
				message : 3 // email已经被注册了。
			})
			return;
		}
		
		register();
		
		/*
		vFn('name',name,function(n){
			if(n== -1){
				res.render('users/register',{
					message : 2 // 出错了，请重新试下
				})
				return;
			}
			if(n== 1){
				res.render('users/register',{
					message : 4 // 用户名已经被注册了。
				})
				return;
			}
			
			// name，email,验证通过
			
		})
		*/
		
	});
	
	function register(){
		var client = mysql(),
			query = 'insert into users set uid = ? , name = ? , password = ? , email = ? , date = ? , icon = ? , token = ?',
			token = md5(uuid.v1() + uid),
			ar = [uid,name,pwd,email,date,icon,token];
			
		client.query(query,ar,function(err,result){
			if(err){
				console.log(err);
				res.render('users/register',{
					message : 2 // 出错了，请重新试下
				})
				return;
			}
			
			req.session.uid = uid;
			res.cookie('token', token, { maxAge : 30*24*60*60*1000 });
			res.cookie('userinfo',JSON.stringify({name:name,icon:icon}), { maxAge: 365*24*60*60*1000 });
			res.redirect('/');
			
		})
	}
}


// 验证
function vorify(req,res){
	var key = req.query.key,
		value = req.query.value;
	
	vFn(key,value,function(n){
		res.jsonp(n);
	});
}


// 验证方法
// -1 错误
// 0 可用
// 1 不可用
function vFn(key,value,cb){
	var client = mysql();
	var r;
	client.query('select * from users where '+ key +' = "' + value + '"' , function(err,result){
		if(err){
			console.log(err);
			cb(-1);
			client.end();
			return
		}
		if(result.length>0){
			cb(1);
		}else{
			cb(0);
		}
		client.end();
	});
}


module.exports = {
	get : get,
	post : post,
	vorify : vorify
}

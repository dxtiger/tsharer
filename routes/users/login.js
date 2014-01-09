var crypto = require('crypto');
	
function md5(str){
	var hash = crypto.createHash('md5');
	hash.update(str);
	str = hash.digest('hex');
	return str;
}


function get(req,res){
	res.render('users/login',{
		message : 'null'
	});
}


function post(req,res){
	var email = req.body.email,
		password = md5(req.body.password),
		mysql = require('../mysql'),
		client = mysql();
	
	
	client.query('select * from users where email ="' + email + '"',function(err,result){
		if(err){
			console.log(err);
			res.send(404,'服务器出问题了，一会再试下吧');
			return;
		}
		if(!result.length){
			res.render('users/login',{
				message : 0 // 不存在此帐户
			})
			return;
		}
		if(result[0].password != password ){
			res.render('users/login',{
				message : 1
			})
			return;
		}
		// 登录成功
		// 写入session，cookie 
		
		req.session.uid = result[0].uid;
		res.cookie('token', result[0].token, { maxAge : 30*24*60*60*1000 });
		var cookie = {
			name : result[0].name,
			icon : result[0].icon
		};
		cookie = JSON.stringify(cookie);
		res.cookie('userinfo',cookie, { maxAge: 30*24*60*60*1000 });
		
		res.redirect('/');
	})
	
}

module.exports = {
	get : get,
	post : post
}

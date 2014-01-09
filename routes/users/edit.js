/**
 * 修改用户信息
 * 
 *  **/

var mysql = require('../mysql'),
	crypto = require('crypto'),
	uid;

function edit(req,res){
	
	var type = req.params.type || 'name',
		client = mysql(),
		uid = req.session.uid;
	
	client.query('select * from users where uid="'+ uid +'"', function(err,result){
		if(err){
			res.send(404,err);
			return;
		}
		result = result[0];
		switch(type){
			case 'name':
				res.render('users/edit_name',{
					name : result.name,
					email : result.email,
					icon : result.icon
				});
				client.end();
				return;
			case 'password':
				res.render('users/edit_password');
				client.end();
				return;
			case 'icon':
				res.render('users/edit_icon',{
					icon : result.icon
				});
				client.end();
				return;
		}
	})
}



// 修改用户名
function edit_name(req,res){
	var name = req.body.name,
		uid = req.session.uid,
		client = mysql();
	
	client.query('update users set name = "'+ name +'" where uid="'+ uid +'"',function(err){
		if(err){
			console.log(err);
			res.send(404,err);
			return;
		}
		res.send('密码修改成功.<a href="/users/edit">返回用户信息页</a>');
		client.end();
	})
}

function md5(str){
	var hash = crypto.createHash('md5');
	hash.update(str);
	str = hash.digest('hex');
	return str;
}

// 修改密码
function edit_pwd(req,res){
	var pwd = req.body.oldpassword,
		newpwd = req.body.password,
		repwd = req.body.repassword,
		uid = req.session.uid,
		client = mysql();
	
	if(newpwd != repwd || newpwd == ''){
		console.log('密码不能为空,新密码填写不正确');
		res.redirect('back');
		client.end();
		return;
	}
	
	pwd = md5(pwd);
	newpwd = md5(newpwd);
	repwd = md5(repwd);
	
	client.query('select password from users where uid="'+ uid +'"',function(err,result){
		if(err){
			console.log(err);
			res.send(404,err);
			client.end();
			return;
		}
		result = result[0].password;
		if(result != pwd){
			res.redirect('back');
			client.end();
			return;
		}
		client.query('update users set password="'+ newpwd +'" where uid="'+ uid +'"',function(err){
			if(err){
				console.log(err);
				res.send(404,err);
				client.end();
				return;
			}
			res.send('密码修改成功.<a href="/users/edit">返回用户信息页</a>');
			client.end();
		})
	})
}


// 修改头像
function edit_icon(req,res){
	var icon = req.files.icon.path,
		uid = req.session.uid,
		client = mysql();
	
	if(!/\.(jpg|png|gif)$/i.test(icon)){
		res.send('要图片哦.jpg,png,gif都可以的.')
		return;
	}
	icon = icon.replace('static','').replace(/\\/g,'/');
	client.query('update users set icon="'+ icon +'" where uid="'+ uid +'"',function(err){
		if(err){
			console.log(err);
			res.send(404,err);
			client.end();
			return;
		}
		res.send('密码修改成功.<a href="/users/edit">返回用户信息页</a>');
		client.end();
	})
	
	
	
}


module.exports = {
	get : edit,
	name : edit_name,
	pwd : edit_pwd,
	icon : edit_icon
}

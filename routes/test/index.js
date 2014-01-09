/**
 * @author luyawei
 */



var mysql = require('../mysql'),
	client;


function index(req,res){
	
	var uid = req.session.uid;
	
	if(uid){
		client = mysql();
		client.query('select * from users where uid='+uid,function(err,results){
			if(err){
				console.log(err);
				return;
			}
			var r = results[0];
			res.send('name:'+r.name + '\n icon:<img src="'+r.icon+'" /><a href="/logout">退出</a><a href="/register">注册</a><a href="/users/edit"">编辑</a>')
			
			client.end();
		})
		return;
	}
	
	res.send('没有用户登录.<a href="/login">登录</a><a href="/register">注册</a>')
}


module.exports = index;

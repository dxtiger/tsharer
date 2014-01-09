var mysql = require('../mysql');


function get(req,res){
	var gid = req.params.gid,
		uid = req.session.uid,
		client = mysql(),
		sql = '';
	
	if(!gid){
		res.redirect('back');
		return;
	}
	
	sql = 'select * from articles where gid = "' + gid + '"';
	
	client.query(sql,function(err,result){
		if(err){
			console.log(err);
			res.send(404,err);
			client.end();
			return;
		}
		if(result.length == 0){
			res.send(404,'未找到相应数据');
			client.end();
			return;
		}
		
		
		
		
		
		var author = result[0].uid;
		
		client.query('select * from users where uid = "' + author + '"',function(err,_res){
			if(err){
				console.log(err);
				res.send(404,err);
				client.end();
				return;
			}
			_res[0] = _res[0] || {};
			result[0].author = {
				name : _res[0].name,
				icon : _res[0].icon
			}
			// 判断 当前登录人 是不是 文章作者。 是，具有修改权限 。 不是，不能修改本文章。
			result[0].power = false;  
			
			if(uid == author){
				result[0].power = true;  
			}
			
			if(uid){
				// 查询当前登录人名字 。登录后用户，评论框 名字直接显示用户名字
				client.query('select name from users where uid = "' + uid + '"',function(err,names){
					if(err){
						console.log(err);
						res.send(404,err);
						client.end();
						return;
					}
					result[0].na = names[0].na || '';
					result[0].date = require('../time')(result[0].date);
					
					res.render('articles/info',result[0]);
					client.end();
				})
			}else{
				result[0].na = '';
				result[0].date = require('../time')(result[0].date);
				
				res.render('articles/info',result[0]);
				client.end();
			}
			
		})
		
	})
}



module.exports = get;
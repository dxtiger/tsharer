var mysql = require('../mysql'),
	crypto = require('crypto');


function md5(str){
	var hash = crypto.createHash('md5');
	hash.update(str);
	str = hash.digest('hex');
	return str;
}



function get(req,res){
	var gid = req.params.gid,
		uid = req.session.uid,
		client = mysql();
	
	
	
	client.query('select * from articles where gid = "' + gid + '"',function(err,result){
		if(err){
			res.send(404,err);
			client.end();
			return;
		}
		if(result.length == 0){
			res.send(404,'未找到相应数据');
			client.end();
			return;
		}
		
		if(result[0].uid != uid){
			res.send(404,'hi,你不能修改不属于你的文章。')
			client.end();
			return;
		}
		
		
		
		res.render('articles/edit',result[0]);
		client.end();
	})
}




function update(req,res){
	var gid = req.body.gid,
		title = req.body.title,
		uid = req.session.uid,
		tid = req.body.type,
		content = req.body.content,
		client = mysql();
		
	// 内容完整度验证
	if(!title){
		res.render('articles/edit',{
			message : 0 // 标题不能为空
		});
		client.end();
		return;
	}
	if(!content && !pics){
		res.render('articles/edit',{
			message : 1 // 内容不能为空
		});
		client.end();
		return;
	}
	
	client.query('select * from articles where gid = "' + gid + '"' ,function(err,result){
		if(err){
			console.log(err);
			res.send(404,'服务器出了点小问题，一会儿再试下吧');
			client.end();
			return;
		}
		
		if(result[0].uid && uid != result[0].uid){
			res.send(404,'对不起,你不能修改此信息');
			client.end();
			return;
		}
		
		
		// 过滤html标签,保留p，pre标签
		//content = content.replace(/<[^(>|p|pre)]*>/g,'');
		
		//content = encodeURIComponent(content)
		
		var sql = 'update articles set title = "'+ title +'" ,   content = "'+ content +'" , tid = "'+ tid +'"  where gid ="' + gid + '"';
		console.log(sql)
		
		
		client.query(sql, function(_err){
			if(_err){
				res.send(404,_err);
				client.end();
				return;
			}
			
			res.redirect('/article/list/' + tid + '/' + gid);
			client.end();
		})
	})

	
}


module.exports = {
	get : get,
	update : update
}

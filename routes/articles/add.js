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
	res.render('articles/add');
}




function add(req,res){
	var date = new Date(),
		gid = uuid.v1(),
		uid = req.session.uid,
		title = req.body.title,
		pics = req.body.pics,
		content = req.body.content,
		client = mysql();
	
	// 过滤html标签,保留p，pre标签
	//content = content.replace(/<[^(>|p|pre)]*>/g,'');
	
	// 内容完整度验证
	if(!title){
		// 标题不能为空
		res.render('articles/add',{
			message : 0 
		});
		client.end();
		return;
	}
	if(!content && !pics){
		// 内容不能为空
		res.render('article/add',{
			message : 1 
		});
		client.end();
		return;
	}

	client.query('insert into articles set gid = ? , title = ? , uid = ? ,  date = ? , content = ? , pics = ? ' , [gid,title,uid,date,content, pics],function(err){
		if(err){
			console.log(err);
			res.send(404,'服务器出了点小问题，一会儿再试下吧');
			client.end();
			return;
		}
		res.redirect('/article');
		client.end();
	})
}





module.exports = {
	get : get,
	add : add
}

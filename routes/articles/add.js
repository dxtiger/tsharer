var mysql = require('../mysql'),
	crypto = require('crypto'),
	gm = require('gm'),
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
		content = req.body.content,
		tid = req.body.type,
		pic,
		info,
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
	
	// 生成摘要
	info = content.replace(/<[^>]*>/g,'');
	info = info.slice(0,120)
	
	// 生成头图
	// 生成缩略图
	
	pic = content.match(/src=('|")([^'"]*)('|")/);
	pic = pic ?  pic[2] :  '';
	
	gm(pic).resize(180,180)
	
	
	function into(){
		
		client.query('insert into articles set gid = ? , title = ? , uid = ? ,  date = ? , content = ? , tid = ? , info = ? , pic = ?' , [gid,title,uid,date,content, tid,info,pic],function(err){
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
	
	
	into()
	
	
}





module.exports = {
	get : get,
	add : add
}

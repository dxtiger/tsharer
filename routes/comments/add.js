/**
 * @author luyawei
 */

var mysql = require('../mysql'),
	uuid = require('uuid');

function add(req,res){
	var gid = req.query.gid,
		client = mysql(),
		uid = req.session.uid || null,
		content = req.query.content;
		date = require('../time')(),
		cid = req.query.cid || uuid.v1(),
		cb = req.query.callback,
		type = req.query.type, // edit or add
		name = req.query.name || '匿名',
		sql = '';
	
	
	// 过滤html标签，保留p，pre
	//content = content.replace(/<[^(>|p|pre)]*>/g,'');
	
	// 内容完整度验证
	if(!content){
		res.send('<script>'+ cb + '({ status : 0,message : 0})</script>'); // 0 : 空内容评论
		client.end();
		return;
	}
	
	
	if(type == 'edit'){
		sql = 'update comments set content = "'+ content +'" , date = "'+ date +'" where cid = "' + cid + '"';
		client.query('select uid from comments where cid = "'+cid+'"',function(err,result){
			if(err){
				console.log(err);
				res.send('<script>'+ cb + '({ status : 0,message : 1})</script>'); // 1 : 数据库查询出问题。
				client.end();
				return;
			}
			if(result[0].uid != uid){
				res.send('<script>'+ cb + '({ status : 0,message : 2})</script>'); // 2 : 你不能修改此评论,因为它不是你写的
				client.end();
				return;
			}
			search();
		})
	}else{
		sql = 'insert into comments set cid = "'+ cid +'" , gid = "'+ gid +'" , uid = "'+ uid +'" , content = "'+ content +'" , date = "'+ date +'" , name = "'+ name +'"';
		search();
	}
	function search(){
		client.query(sql,function(err){
			
			if(err){
				console.log(err);
				res.send('<script>'+ cb + '({ status : 0,message : 1})</script>'); // 1 : 数据库查询出问题。
				client.end();
				return;
			}
			var result = {
				cid : cid,
				gid : gid,
				uid : uid,
				name : name,
				date : date,
				content : content
			}
			res.send('<script>'+ cb + "({ status : 1,result :'"+ JSON.stringify(result) + "'})</script>");
			client.end();
			return;
		})
	}
}

module.exports = add;
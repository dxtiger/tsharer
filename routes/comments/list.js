var mysql = require('../mysql');

function list(req,res){
	var gid = req.query.gid,
		uid = req.session.uid,
		start = req.query.start*1,
		client = mysql();
	
	client.query('select * from comments where gid = "'+ gid + '" limit ' + start + ',' + (start+20) ,function(err,result){
		if(err){
			console.log(err);
			res.jsonp({status : 0}); // 出错返回 status = 0;
			client.end();
			return;
		}
		result.forEach(function(item){
			if(uid == item.uid){
				item.power = 1 // 判断当前登录用户是否具有修改,删除此条评论的权限. 1 = true , 0 = false
			}else{
				item.power = 0
			}
			item.date = require('../time')(item.date,1);
		})
		res.jsonp({
			status : 1,
			result : result,
			start : (start+20)
		})
		client.end();
	})
}

module.exports = list;

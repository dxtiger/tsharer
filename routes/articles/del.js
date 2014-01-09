var mysql = require('../mysql');

function del(req,res){
	var gid = req.params.gid,
		uid = req.session.uid,
		client = mysql();
	
	client.query('select uid from articles where gid = "' + gid + '"', function(err,result){
		if(err){
			console.log(err);
			res.send(404,err);
			client.end();
			return;
		}
		result = result[0];
		if(!result){
			res.send(404,'你要删除的信息未找到');
			client.end();
			return;
		}
		if(result.uid != uid){
			res.send(404,'你没有权限删除此信息');
			client.end();
			return;
		}
		
		client.query('delete from articles where gid="' + gid + '"',function(err){
			if(err){
				res.send(404,err); 
				client.end();
				return;
			}
			res.redirect('/');
			client.end();
		})
	})
	
}



module.exports = del
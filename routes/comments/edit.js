
var mysql = require('../mysql');

function edit(req,res){
	var cid = req.query.cid,
		uid = req.session.uid,
		client = mysql();
	
	client.query('select uid from comments where cid = "'+cid+'"',function(err,result){
		if(err){
			console.log(err);
			res.jsonp({
				status : 0,
				message : err
			})
			client.end();
			return;
		}
		if(result[0].uid != uid){
			res.jsonp({
				status : 0,
				message : '你不能修改此评论.因为它不是你写的!'
			})
			client.end();
			return;
		}
		res.jsonp({
			status : 1,
			result : result[0]
		})
		client.end();
	})
}

module.exports = edit
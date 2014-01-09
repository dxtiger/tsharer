/**
 *  用户验证
 *  
 *  **/

var mysql = require('../mysql');

function authen(req,res,next){
	var token = req.cookies.token;
	if(req.session.uid){
		next();
		return;
	}
	if(!token){
		res.redirect('/login');
		return;
	}
	var query = 'select * from users where token="' + token + '"',
		client = mysql();
	
	client.query(query,function(err,result){
		if(err){
			console.log(err);
			res.send(404,err);
			return;
		}
		result = result[0];
		if(!result || result.token != token){
			res.redirect('/login');
			return;
		}
		req.session.uid = result.uid;
		next();
		client.end();
	})
	
}

module.exports = authen;
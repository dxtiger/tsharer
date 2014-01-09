var mysql = require('../mysql'),
	client;



function addpost(req,res){
	var date = req.param('date') ||  new Date(),
		isnew = req.param('uid') ? false : true,
		uid = req.param('uid') || date.getTime(),
		name = req.param('name'),
		password = req.param('password'),
		email = req.param('email');
	
	client = mysql();
	if(isnew){
		client.query('insert into users set uid = ? , name = ? , password = ? , email = ? , date = ?',[uid,name,password,email,date],function(err,results){
			if(err){
				console.log(err);
				return;
			}
			res.redirect('/index');
			client.end();
		})
	}else{
		client.query('update users set name= "'+ name +'" ,password= "'+ password +'",email= "'+ email +'" where uid = "' + uid + '"' , function(err){
			if(err){
				console.log(err);
				return;
			}
			res.redirect('/index');
			client.end();
		})
	}
}




module.exports = addpost;
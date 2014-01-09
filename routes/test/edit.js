var mysql = require('../mysql'),
	client;


function get(req,res){
	client = mysql();
	var uid = req.param('uid');
	client.query('select * from users where uid = "'+uid + '"' ,function(err,results){
		if(err){
			console.log(err);
			return;
		}
		res.render('edit',results[0]);
		client.end();
	})
}


module.exports = get

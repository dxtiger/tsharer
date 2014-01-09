/**
 * @author luyawei
 */

var mysql = require('../mysql'),
	client = mysql();


function del(req,res){
	var uid = req.param('uid');
	client.query('delete from users where uid = "'+ uid + '"' , function(err){
		if(err){
			console.log(err);
			return;
		}
		res.redirect('/index');
	})
}


module.exports = del;
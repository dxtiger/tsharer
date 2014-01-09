var gm = require('gm');


function read(req,res){
	var url = 'http://bcs.duapp.com/babyphotos/883b45b05b1a11e3b5bb6f8615973a26_300';
	gm(url).resize(100,100).write('./app/static/uploads/a.png',function(err){
		if(err){
			console.log(err);
			res.send(err);
			return;
		}
		res.send('that\'s ok');
	})
}


module.exports = read;

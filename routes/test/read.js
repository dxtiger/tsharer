var mysql = require('../mysql');

function read(req,res){
	var client = mysql();
	
	client.query('select * from bcs',function(err,result){
		if(err){
			console.log(err);
			return;
		}
		var src = result[0]._GET;
		
		var http = require('http'),
			_req = http.request(src,function(_res){
				var body = '';
				_res.on('data',function(chunk){
					console.log(chunk)
					body += chunk;
				})
				_res.on('end',function(){
					res.send(body)
				})
			});
			
			_req.on('error',function(err){
				console.log(err);
			})
			
			
			_req.setHeader('content-length',0);
			_req.write('');
			_req.end();
	})
}

module.exports = read

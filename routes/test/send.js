/**
 * @author luyawei
 */

var http = require('http'),
	mysql = require('../mysql'),
	qstring = require('querystring'),
	_req;




var options = {
  hostname: 'developer.baidu.com',
  port: 80,
  path: '/bae/bcs/key/getsign',
  method: 'post'
};


function send(n,cb){
	
	_req = http.request(options,function(_res){
		
		_res.setEncoding('utf8');
		
		var d;
	  	_res.on('data', function (chunk) {
	    	d = JSON.parse(chunk);
	    	d = d.content;
	    	
	    	cb(d);
	    	return;
		});
		
	})
	
	_req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
	var data = {
		host : 'bcs.duapp.com',
		ak : 'WSonCD4QzdRFyoThxL3Wxoy6',
		sk : '7OGutglO1lf5MyWvNtawjzn4XFDXN5lb',
		//ak : '8851eed3a3109d8b079da1323fd792a4',
		//sk : 'DAf9a8955171264bf2acf1f2037bf390',
		bucket : 'babyphotos',
		object : '/'+ n
	}
	
	data = qstring.stringify(data);
	
	

	_req.setHeader('Content-Length',data.length);
	_req.setHeader('Content-Type','application/x-www-form-urlencoded');
	_req.setHeader('x-bs-acl','public-read');
	_req.setHeader('Cookie','BDUSS=J6U2xMQ3Ntd01LckRnaHdhSXJwdXphUXJVQjNWN0VXaDAzOGpUUUpHYlRkNEJTQVFBQUFBJCQAAAAAAAAAAAEAAACaNwU4ZHhfdGlnZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANPqWFLT6lhSTW')
	
	
	
	_req.write(data);
	_req.end();
	
}


module.exports = send;

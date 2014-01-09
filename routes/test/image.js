var http = require('http'),
	send = require('./send'),
	uuid = require('uuid');

var data,
	url;
function get(req,res){
	
	
	function _request(){
		var options = {
			  hostname: 'http://p1.yokacdn.com',
			  port: 80,
			  path: '/pic/beauty/face/2013/U243P1T1D876819F9DT20131113114544.jpg',
			  method: 'get'
			};
		
		var _req = http.request('http://p1.yokacdn.com/pic/beauty/face/2013/U243P1T1D876819F9DT20131113114544.jpg',function(_res){
				
				_res.on('data', function (chunk) {
			    	data += chunk;
			    	//post(req,res,url,data);
			    	//return;
				});
				
				_res.on('end',function(){
					post(req,res,url,data);
				})
				
			})
		
			_req.on('error',function(err){
				console.log('get img : ' + err);
			})
			_req.write('');
			_req.end();
	}
	
	
	send(uuid.v1(),function(d){
		url = d.POST;
		_request();
	})
}

function post(req,res,url,data){
	
	var options = {
		hostname : url.replace(/\.com.*$/,'.com'),
		port : 80,
		path : url.replace(/^.*\.com/,''),
		method : 'post'
	}
	
	
	
	var _req = http.request(options,function(_res){
		res.render('test/image',{
			url : data.GET
		})
	})
	
	_req.on('error',function(err){
		console.log('post err:' + err);
	})
	
	_req.setHeader('Content-Length',data.length);
	_req.setHeader('x-bs-acl','public-read');
	_req.setHeader('Content-Type','multipart/form-data');
	
	_req.write(data);
	_req.end();
}

module.exports = get

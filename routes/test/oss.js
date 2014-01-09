var oss = require('oss');

function get(req,res){
	res.render('test/oss')
}

function post(req,res){
	
	var path = req.files.file.path;
	var name = req.files.file.name;
	
	var client = new oss({
		accessId : 'WBJSyVwHxGQDzsiz',
       	accessKey : 'sjdVhXzGQlDfFv0EyHZg6WMDGbxM3p',
       	host : 'oss-cn-hangzhou.aliyuncs.com',
       	port : 80
	});
		
	client.put_object({
		bucket : "ryw401", 
		object : name , 
		srcFile : path,
		gzip : true 
		},
		function(err,results){
	        if(err) throw err;
	        res.send('<img  src="http://ryw401.oss-cn-hangzhou.aliyuncs.com/'+ name +'" />')
	       
    	}
    );
    
}


module.exports = {
	get : get,
	post : post
}

var qstring = require('querystring'),
	uuid = require('uuid');

function index(req,res){
	
	var n = uuid.v1();
	
	n = n.replace(/\-/g,'');
	
	var send  = require('./send');
	
	var data = {},c=0;
	
	function cb(d,num){
		var str = '';
		if(num){
			str += '_'+num;
		}
		for(var key in d){
			data[key+str] = d[key]
		}
		c++;
		if(c==4){
			res.jsonp(data);
		}
	}
	send(n,function(d){
		cb(d)
	});
	send(n+'_50',function(d){
		cb(d,50)
	});
	send(n+'_300',function(d){
		cb(d,300)
	});
	send(n+'_600',function(d){
		cb(d,600)
	});
}


module.exports = index

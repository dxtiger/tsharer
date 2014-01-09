/**
 *	 列表:
 * 		1 全部
 * 		2 分类,如:某一用户的,某分类的全部文章
 * 		3 时间段的文章
 * 		4 查询.
 * 
 *  **/


var max = 50;
 
 
// all
function list(req,res){
	
	var start = req.query.start || 0,
		type = req.query.type || null,
		user = req.query.user || null,
		callback = req.query.callback;
		
	
	search({
		from : start,
		type : type,
		user : user,
		cb : function(err,result){
			if(err){
				console.log(err);
				res.send(404,err);
				return;
			}
			
			// jsopn 请求
			if(callback){
				res.jsonp({
					articles : result, // 文章 array 
					start : (start*1+max*1) // 下次请求的start值
				});
				return;
			}
			
			
			// 页面请求
			res.render('articles/list',{
				articles : result,
				start : (start*1+max*1) // 下次请求的start值
			});
		}
	})
}





function search(options){
	/**
	 *	 from : 开始编号
	 * 	 to   : 结束编号
	 *   limit: 条数 ,默认50条
	 *   type ：文章分类
	 *   user : 用户
	 *   cb   : 回调方法
	 * 
	 *  **/
	
	var sql = '',
		count = '',
		num,
		opt = options || {},
		mysql = require('../mysql'),
		client = mysql(),
		from = opt.from || 0,
		table = 'articles',
		limit = opt.limit || max,
		to = opt.to || (from + limit),
		type = opt.type,
		cb = opt.cb,
		user = opt.user;
	
	sql = 'select * from '+ table;
	count = 'select count(*) from ' + table; // 查询总数
	
	
	if(type && user){
		sql += ' where type = "' + type + '"' + ' and name = "' + user + '"'; 
		count += ' where type = "' + type + '"' + ' and name = "' + user + '"'; 
	}
	
	if( type && !user){
		sql +=  ' where type = "' + type + '"';
		count += ' where type = "' + type + '"'; 
	}
	
	if(!type && user){
		sql +=  ' where name = "' + user + '"';
		count +=  ' where name = "' + user + '"';
	}
	
	sql += ' order by date desc limit ' + from + ','  + to;
	
	var res;
	
	
	// 查询文章
	client.query(sql,function(err,result){
		if(err){
			cb(err);
			client.end();
			return;
		}
		if(result.length == 0){
			cb(err,result);
			client.end();
			return;
		}
		
		// 查询总数,用于翻页
		/*
		client.query(count,function(_er,_max){
			
			if(_er){
				cb(_er);
				client();
				return;
			}
			num = _max;
		})
		*/
		// 查询对应的作者信息
		author(result);
		
		
		
		function author(result){
			var uids = [];
			
			result.forEach(function(item){
				item.date = require('../time')(item.date,1);
				uids.push(item.uid);
			});
			
			uids = uids.join(',');
			uids += ',';
			uids = '"' +  uids.replace(/\'/g,'"').replace(/([^\,]*\,){2,}/g,'$1').replace(/\,$/,'') + '"' ;
			
			
			var sql = 'select * from users where uid in (' + uids + ')';
			
			
			// 获取对应的作者信息
			client.query(sql,function(er,_result){
				if(er){
					cb(er);
					client.end();
					return;
				}
				result.forEach(function(item){
					_result.forEach(function(it){
						if(it.uid == item.uid){
							item.author = {
								name : it.name,
								icon : it.icon,
								uid : it.uid
							}
						}
					})
					
				})
				cb(er,result);
				client.end();
			})
		}
		
		
	});
	
		
}

module.exports = list;

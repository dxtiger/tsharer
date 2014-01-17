/**
 *
 * 栏目管理:
 * 	添加
 *  删除
 *  修改
 *  初始化栏目数据
 * 
 * 
 * 
 *  **/


// 获取所有栏目信息,设置app全局变量
function all(app){
	var mysql = require('../mysql'),
		client = mysql(),
		sql = 'select * from types';
	
	client.query(sql,function(err,result){
		if(err){
			console.log(err);
			app.set('types',[]);
			client.end()
			return;
		}
		
		app.set('types',result);
		client.end();
	})
	
}


// 添加栏目
function add(req,res){
	
}



module.exports = {
	all : all
}

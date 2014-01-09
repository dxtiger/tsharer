/**
 * @author luyawei
 */




function create(){
	var mysql = require('mysql');

	var dev = true ;
	
	var username = dev ? 'root' : process.env.BAE_ENV_AK;
	var password = dev ? '123456' : process.env.BAE_ENV_SK;
	var db_host = dev ? '127.0.0.1' : process.env.BAE_ENV_ADDR_SQL_IP;
	var db_port = dev ? '3306' : process.env.BAE_ENV_ADDR_SQL_PORT;
	var db_name = dev ? 'blog' : 'rsWMyDsqdPkIcHNSqMPL'; 
	var option = {
	  host: db_host,
	  port: db_port,
	  user: username,
	  password: password,
	  database: db_name
	}
	
	
	return mysql.createConnection(option);
	
}

module.exports = create;

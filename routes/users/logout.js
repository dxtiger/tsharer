/**
 * @author luyawei
 */

function logout(req,res){
	/**
	 *   清除session后 redis数据库中还是存在key.  
	 *   destroy方法有时可以删除key,有时不行.
	 * 
	 * **/
	//req.session.destroy(req.session.uid);
	req.session.uid = null;
	res.clearCookie('token');
	res.redirect('/');
}

module.exports = logout;

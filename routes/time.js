module.exports = function(t,type){
	var time = t ? new Date(t) : new Date(),
		y = time.getFullYear(),
		m = time.getMonth() + 1,
		d = time.getDate(),
		h = time.getHours(),
		m2 = time.getMinutes(),
		s = time.getSeconds();
	if(type){
		return y + '-' + m + '-' + d ;
	}
	return y + '-' + m + '-' + d + ' ' + h + ':' + m2 + ':' + s;
}

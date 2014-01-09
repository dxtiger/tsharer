// 图片上传


function upload(req,res){
	
	
	
	
	
	var path = req.files.imgFile.path,
		cb = req.body.callback;
	
	
	
	if(!/\.(jpg|png|gif)$/i.test(path)){
		res.send('<script>'+ cb +'("要图片哦.jpg,png,gif都可以的.")</script>')
		return;
	}
	
	function change(str){
		return str.replace(/\\/g,'/').replace('static','');
	}
	
	path = change(path);
	
	res.send('{"error" : 0,"url" : "'+ path +'"}')
	
	return;


	res.send('<script>'+ cb +'(null,"'+ path +'")</script>')
	
	
	
}


module.exports = upload;

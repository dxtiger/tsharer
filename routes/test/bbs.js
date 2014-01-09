var http = require('http'),
	qstring = require('querystring');

function post(req,res){
	var options = {
		  hostname: 'bbs.yoka.com',
		  port: 80,
		  path: '/post.php',
		  method: 'post'
		};
	var n = 0;
	
	function send(){
		var url = 'http://bbs.yoka.com/post.php?action=reply&fid=94&tid=5470178&extra=page%3D1&replysubmit=yes'
	
		var _req = http.request(url,function(_res){
			_res.setEncoding('utf8');
			
			var d,
				body = '';
		  	_res.on('data', function (chunk) {
		  		body += chunk;
			});
			_res.on('end',function(){
				n++;
				
				var sid = res.get('Set-Cookie');
				
				console.log(n);
				res.send(sid);
				
				//setTimeout(send,10000);
			})
		})
		
		_req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});
		
		var data = {
			formhash : 'bd53b2ad',
			usesig : 1,
			subject : '',
			message : '旅行是一件开心的事',
			sync_qq : 1
		}
		
		data = qstring.stringify(data);
	
		_req.setHeader('Content-Length',data.length);
		_req.setHeader('Content-Type','application/x-www-form-urlencoded');
		_req.setHeader('Cookie','stat_u=f14067c8-c756-14af-5ed4-2b1afaee6cf9; yka_gid=5a132044-bba8-4de8-27ef-11bb43214759; SUV=1309221311305233; AMP_UID=F9Jsg0uE31f26UiebLIj6; auth=6d93E2vcp9uMvP%2Fqt3sAMKnUtUIJ8%2Fgoga%2F8nxJBCRDjaCO7pWUy12UfLkjE25vShVBOtSx5zpTcShkrD%2FNtLf9lgZU9; loginuser=dxtiger; lzstat_uv=16704879124371902|2678019@2044254@2501426@2501418; pgv_pvi=6659158016; __v=1.3376170203792203300.1386145779.1386299505.1386317674.8; __SessionHandler=b838ea7f4b56ec8beabbdb076244a823; KM.PASSPORT.MEMBER=uid%3D2970244%26guid%3D3bc5a9325f9c04572acee6b6261bd7e0%26id%3Ddxtiger%26nickName%3Ddxtiger%26nick%3D%26third_source%3D0%26visitDate%3D1386321651%26pwd%3Db4cdd0590facd7ad88bb1385a54f1153%26sign2%3D86b3f3091c10a61c536f3d59671ac12d%26sighbbs%3D61342568523C0C75897AC7FDEBC121CE%26avatar_url%3Dhttp%3A%2F%2Fucenter.yoka.com%2Fdata%2Favatar%2F002%2F97%2F02%2F44_avatar_small.jpg%26expire_time%3D604800%26is_validate%3D1%26open_id%3D%26qq_nick%3D%26real_name%3D%26sign%3D7a45854631a2c5cb17ab2bdc49717ba5; KM.PASSPORT.MEMBER.LastLogin=login_time%3D1386321651%26register_time%3D%26reg_source%3D%26login_source%3Dhttp%3A%2F%2Fbbs.yoka.com%2Fpageproxy.html%3Fmethod%3Dwindow.parent.yo_topNav.yokaLoginMsg%26error_code%3D1; KM.PASSPORT.MEMBER.TRACK=uid%3D2970244%26nickName%3Ddxtiger; KM.PASSPORT.MEMBERGUID=3bc5a9325f9c04572acee6b6261bd7e0; __utma=104826632.1583462172.1383120116.1386557344.1386560889.10; __utmz=104826632.1386145779.1.1.utmcsr=ads.yoka.com|utmccn=(referral)|utmcmd=referral|utmcct=/temp/7/2013/1204/1641.html; _ga=GA1.2.1583462172.1383120116; yka_ph=%7B%20%27value%27%3A%20%2700000000000000000000000110011%27%2C%27lastdate%27%3A%20%271386642988958%27%7D; yka_srchost=hzp.yoka.com; stat_t=e86de978-ede1-12ec-e166-0044011b1549; pgv_si=s2204242944; cdb_auth=qmRVkrlR%2FAMH16CLQlRtJLIj%2FgW8P%2FcwXSDaWtQRqOQLCSHmLLyDdi%2FjfUJ6%2B1kAgg; cdb_visitedfid=94D105; focusdontaskme=1; cdb_oldtopics=D5470178D5510339D; cdb_fid94=1386659587; cdb_sid=hh4cdz; yka_tid=1f334fcf-81c4-5842-52fd-ead33b893038; Hm_lvt_a641a94f2a28291909af4213f237173a=1386292255,1386552602,1386568341,1386642989; Hm_lpvt_a641a94f2a28291909af4213f237173a=1386659674; CNZZDATA30072180=cnzz_eid%3D558485934-1386321368-http%253A%252F%252Fbbs.yoka.com%26ntime%3D1386659372%26cnzz_a%3D13%26sin%3Dhttp%253A%252F%252Fspace.yoka.com%252Ftie%252F%26ltime%3D1386659538857%26rtime%3D1; Hm_lvt_9e4d2565bb3f1e39bbc7ba3702137110=1386321720,1386659539; Hm_lpvt_9e4d2565bb3f1e39bbc7ba3702137110=1386659674; __utma=193400574.1583462172.1383120116.1386321719.1386659539.2; __utmb=193400574.14.10.1386659539; __utmc=193400574; __utmz=193400574.1386659539.2.2.utmcsr=space.yoka.com|utmccn=(referral)|utmcmd=referral|utmcct=/tie/')
		
		_req.write(data);
		_req.end();
		
	}
	
	send();
	
	
}

module.exports = post

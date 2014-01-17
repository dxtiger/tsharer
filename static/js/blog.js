
/**
 *
 *  删除信息
 * 
 *  **/
(function(window){
	function click(e){
		var tar = Event.target(e);
		/** 删除文章 **/
		if(!tar) return;
		if(tar.getAttribute('data-action') == 'delete'){
			Event.stop(e);
			var uid = tar.getAttribute('data-uid');
			if(confirm('确定删除?')){
				location.href = '/del?uid=' + uid;
			}
		}
	}
	Domready(function(){
		//Event.add(document.body,'click',click);
	})
})(window);




/**
 * comments
 *  **/
;(function(){
	var list = [],
		obj,
		gid,
		isComment = location.href.indexOf('/info') > -1 ? true : false,
		tem = '<strong class="comment_name"><@= name @>:</strong>'+
			  '<span class="comment_time"><@= date @>'+
			  '<@ if(power){ @>'+
			  '<a href="#" data-cid="<@= cid @>">删除</a>'+
			  '<@ } @>'+
			  '</span>'+
			  '<div class="comment_info"><@= content @></div>',
		ke = TE(),
		textareaId,
		start = 0,
		textarea;
	
	if(!isComment) return;
	
	function get(_uid,id){
		gid = _uid;
		getMore(id);
	}
	function getMore(id){
		var q = Request();
		q.jsonp({
			url : '/comment/list?gid=' + gid + '&start='+start,
			success : function(d){
				if(d.status == 0){
					alert('读取评论出错了。')
					return;
				}
				list = d.result;
				render(id);
				start = d.start;
			}
		})
	}
	function render(id){
		if(!obj) obj = document.getElementById(id);
		var frame = document.createDocumentFragment();
		for(var i=0,l=list.length;i<l;i++){
			var div = document.createElement('div');
			div.className = 'comment_item';
			console.log(list[i].date)
			div.innerHTML = ke.render(tem,list[i]);
			frame.appendChild(div);
			div = null;
		}
		// 增加 更多链接
		
		obj.appendChild(frame);
	}
	
	function add(options){
		if(options.status == 0){
			alert('添加评论失败了。再试试?!');
			return;
		}
		
		var div = document.createElement('div');
		div.className = 'comment_item';
		//options.result = decodeURIComponent(options.result);
		console.log(JSON.parse(options.result))
		div.innerHTML = ke.render(tem,JSON.parse(options.result));
		obj.appendChild(div);
		var h = div.offsetHeight;
		div.style.height = '0';
		var anima = Anima(div);
		anima.start({
			height : h
		})
		anima.complete(function(){
			if(!textarea) textarea = document.getElementById(textareaId);
			textarea.value = '';
		})
		
	}
	
	function init(id,tId){
		obj = document.getElementById(id);
		textareaId = tId;
		Event.add(obj,'click',del)
	}
	function del(e){
		var tar = Event.target(e);
		if(tar.nodeName == 'A' && tar.getAttribute('data-cid')){
			Event.stop(e);
			var div = tar.parentNode.parentNode,
				anima = Anima(div),
				q = Request();
			q.jsonp({
				url : '/comment/del?cid=' + tar.getAttribute('data-cid'),
				success : function(){
					anima.start({
						height : 0
					})
					anima.complete(function(){
						obj.removeChild(div);
						div = null;
						anima = null;
					})
				}
			})
		}
	}
	window['Comments'] = {
		get : get,
		add : add,
		init : init
	}
})();



/**
 *  userinfo
 * 
 *  **/
(function(){
	var userinfo = Cookie.read('userinfo'),
		token = Cookie.read('token'),
		loginDom;
	
	
	
	function init(){
		loginDom = document.getElementById('nav_user');
		if(!loginDom) return
		
		if(!token){
			loginDom.innerHTML = '<p><a href="/login">登录</a> | <a href="/register">注册</a></p>';
			return;
		}
		userinfo = decodeURIComponent(userinfo);
		userinfo = eval( '(' + userinfo + ')');
		loginDom.innerHTML = '<div>'+
								'<a href="#"><img src="'+ userinfo.icon +'" class="icon_user" /></a>'+
								'<span><a href="#">'+ userinfo.name +'</a></span>'+
								'<ul>'+
									'<li><a href="/usercenter">home</a></li>'+
									'<li><a href="/article/add">发文章</a></li>'+
									'<li><a href="/logout">logout</a></li>'+
								'</ul>'+
							'</div>';
		
		
		var timer = null;
		function show(e){
			if(timer){
				clear()
			}
			Element.addClass(loginDom,'nav_user_on');
		}
		function hide(e){
			if(timer) return;
			timer = setTimeout(function(){
				Element.removeClass(loginDom,'nav_user_on');
			},100)
		}
		function clear(){
			clearTimeout(timer);
			timer = null;
		}
		Event.add(loginDom,'mouseover',show);
		Event.add(loginDom,'mouseout',hide);
		
	}
	Domready(function(){
		init();
	})
})();




/**
 *
 *  图片上传
 * 
 *  **/

;(function(window,document){
	var obj,tip,result,state,upload,data,icon;
	function init(pid,iid,stateId,uploadId,isIcon){
		
		obj = document.querySelector(pid);  // 显示图片的容器
		result = document.querySelector(iid); // 记录图片结果 input
		state = document.querySelector(stateId);  // 上传状态容器,进度显示
		upload = document.querySelector(uploadId); // 上传flash的容器id
		icon = isIcon ? true : false; // 是否为头像
		
		getUrl();
		
		if(result.value != ''){
			success('success',result.value);
		}
		
	}
	function create(){
		var bigaction = data.POST,
			smallaction = icon ? data['POST_50'] : data['POST_300'],
			smallwidth = icon ? 50 : 300,
			smallheight = icon ? 50 : 300,
			callback = 'uploadFile.success',
			progress = 'uploadFile.progress';
		
		
			
		var flash =  '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="uploadFlash">'+
                '<param name="movie" value="http://bcs.duapp.com/babyphotos/upload.swf?" />'+
                '<param name="quality" value="high" />'+
                '<param name="allowScriptAccess" value="always" />'+
                '<param name="wmode" value="transparent" />'+
                '<param name="allowFullScreen" value="true" />'+
                '<param name="flashvars" value="bigaction='+ bigaction +'&smallaction='+ smallaction +'&smallwidth='+ smallwidth +'&smallheight='+ smallheight +'&callback='+ callback +'&progress='+ progress +'">'+
                '<!--[if !IE]>-->'+
                '<object type="application/x-shockwave-flash" data="http://bcs.duapp.com/babyphotos/upload.swf?" width="100%" height="100%">'+
                    '<param name="quality" value="high" />'+
                    '<param name="allowScriptAccess" value="always" />'+
                    '<param name="allowFullScreen" value="true" />'+
                    '<param name="wmode" value="transparent" />'+
                    '<param name="flashvars" value="bigaction='+ bigaction +'&smallaction='+ smallaction +'&smallwidth='+ smallwidth +'&smallheight='+ smallheight +'&callback='+ callback +'&progress='+ progress +'">'+
                '<!--<![endif]-->'+
                '<!--[if gte IE 6]>-->'+
                    '<p> '+
                        'Either scripts and active content are not permitted to run or Adobe Flash Player version'+
                        '11.4.0 or greater is not installed.'+
                    '</p>'+
                '<!--<![endif]-->'+
                    '<a href="http://www.adobe.com/go/getflashplayer">'+
                        '<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash Player" />'+
                    '</a>'+
                '<!--[if !IE]>-->'+
                '</object>'+
                '<!--<![endif]-->'+
            '</object>';
           
        upload.innerHTML = flash;
	}
	function getUrl(){
		var jsonp = Request().jsonp({
			url : '/geturl',
			success : function(d){
				// data 包含4中尺寸地址。post：原尺寸， post_50 : 50宽，post_300 : 300宽，post_600 : 600宽
				data = d;
				create();
			}
		})
	}
	function success(message,src){
		//success成功，fail1超过100M，fail2尺寸过大
		if(!src){
			src = (icon ? data['GET_50'] : data['GET'] ).replace(/\?.*/,'')
		}
		if(message == 'success'){
			obj.innerHTML = '<img src="'+ src + '?' + Math.random()  +'" />'
			result.value = src;
			state.innerHTML = '';
		}
		if(message == 'fail1' || message == 'fail2'){
			obj.innerHTML = '图片太大了.'
			state.innerHTML = '';
		}
	}
	function progress(c,m){
		state.innerHTML = '上传中...请稍候';
	}

	
	window['uploadFile'] = {
		init : init,
		success : success,
		progress : progress
	}
})(window,document);


/**
 *
 * 错误处理
 * 
 *  **/
(function(window,document){
	var data = {
		article : ['写个标题吧，大侠','写点内容吧，大侠'],
		register : ['两次密码不一致','头像只支持jpg,png,gif文件','服务器出问题了，一会儿再试吧','email已经被注册了,换一个吧'],
		login : ['不存在此帐户','密码不正确']
	},
	objs = [];
	
	function init(ar){
		for(var i=0,l=ar.length;i<l;i++){
			objs[i] = document.getElementById(ar[i]);
		}
	}
	
	function show(key,n){
		if(!n && n != 0){
			return;
		}
		objs[n].innerHTML = data[key][n];
	}
	function clear(n){
		objs[n].innerHTML = '';
	}     
	
	window['Message'] = {
		init : init,
		show : show,
		clear : clear
	}
	
})(window,document)

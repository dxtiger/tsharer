/**
 * @author tiger
 * 
 */

if(typeof console === 'undefined'){
	console = { 
		log : function(){}
	};
}

;(function(){
	Function.prototype.method = function(name,func){
		if(!this.prototype[name]){
			this.prototype[name] = func;
		}
	};
	if( !window.XMLHttpRequest && window.ActiveXObject){
	    try{
			document.execCommand('BackgroundImageCache', false, true);
		}catch (e){
		};
	}
/*
 * String
 */
	var str = {
		rgbtoHex : function(){
			var s = this.match(/\d{1,3}/g);
			if(!s) return null;
			if(s.length == 4 && s[3]==0) return 'transparent';
			var result = [];
			for(var i=0,l=s.length;i<l;i++){
				s[i] = (s[i]-0).toString(16);
				result.push(s[i].length==1 ? '0'+s[i] : s[i]);
			}
			return '#'+result.join('');
		},
		camelCase : function(){
			return this.replace(/-\D/g,function(m){return m.charAt(1).toUpperCase()})
		},
		hyphenate : function(){
			return this.replace(/[A-Z]/g,function(m){return '-'+m.charAt(0).toLowerCase()})
		}
	};
	
	for(var key in str){
		if(str.hasOwnProperty(key)){
			String.method(key,str[key]);
		}
	}
	
/*
 * Array
 */ 	



	
})();


/*
 * Element
 */
var Element = (function (window, document, undefined){
	var classList = document.documentElement.classList;
	var apollo = {
		create : function(){

		},
		hasClass : function (elem, className) {
			if (classList) {
				return elem.classList.contains(className);
			} else {
				return new RegExp('(^|\\s)' + className + '(\\s|$)').test(elem.className);
			}
		},
		addClass : function (elem, className) {
			if (classList) {
				elem.classList.add(className);
			} else {
				if (!apollo.hasClass(elem, className)) {
					elem.className += (elem.className ? ' ' : '') + className;
				}
			}
		},
		removeClass : function (elem, className) {
			if (classList) {
				elem.classList.remove(className);
			} else {
				if (apollo.hasClass(elem, className)) {
					elem.className = elem.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
				}
			}
		},
		toggleClass : function (elem, className) {
			if (classList) {
				elem.classList.toggle(className);
			} else {
				var toggle = apollo.hasClass(elem, className) ? apollo.removeClass : apollo.addClass;
				toggle(elem, className);
			}
		},
		getStyle : function(obj,style){
			var result;
			function getComStyle(property){
				if(obj.currentStyle) return obj.currentStyle[property.camelCase()];
				var computed = window.getComputedStyle(obj, null);
				return (computed) ? computed.getPropertyValue(property.hyphenate()) : null;
			}
			if(style == 'opacity'){
				if(window.ActiveXObject){
					result = getComStyle('filter').replace(/[^0-9\.]/g,'');
					result = result== '' ? 1 : parseInt(result*100)/10000;
					return result;
				}
				result = parseFloat(getComStyle(style));
				result = !result && result != 0 ? 1 : result;
				return result;
			}
			style = style.camelCase();
			result = obj.style[style];
			if ( !result&&result !== 0 || style == 'zIndex') {
				result = [];
				for (var key in ShortStyles) {
					if (key != style) continue;
					for (var s in ShortStyles[key]) result.push(Element.getStyle(obj,s));
					return result.join(' ');
				}
				result = getComStyle(style);
			}
			if(navigator.userAgent.toLowerCase().indexOf('msie') > -1){
				if(/^(width)|(height)$/.test(style)){
					var path = style == 'width' ? ['left','right'] : ['top','bottom'],
						size = 0;
					size = (parseInt(this.getStyle(obj,'padding-'+path[0])) || 0) + (parseInt(this.getStyle(obj,'padding-'+path[1])) || 0) + 
						(parseInt(this.getStyle(obj,'border-'+path[0]+'-width')) || 0 ) + (parseInt(this.getStyle(obj,'border-'+path[1]+'-width')) || 0);
					result = obj['offset'+style.replace(/\b[a-z]/,function(m){return m.toUpperCase();})]-size;
					return result;
				}
			}
			return result;
		},
		setStyle : function(obj,values){
			var str = ';';
			for(var key in values){
				if(values.hasOwnProperty(key)){
					if(key == 'opacity'){
						str += key + ':' + values[key] + ';filter:alpha(opacity='+ values[key]*100 +');';
						continue;
					}
					if(/(rgb)|(#)/i.test(values[key]) || !parseInt(values[key]) || /(scroll)|(index)/i.test(key)){
						str += key +':'+ values[key] +  ';';
						continue;
					}
					if(key == 'zIndex'){
						str += key +':'+ values[key];
						continue;
					}
					str += key +':'+ Math.round(values[key])  + 'px;';
				}
			}
			obj.style.cssText += str;
			str = null;
			return ;
		},
		getPosition:function(obj,relative){
			var o = typeof obj === 'string' ? document.getElementById(obj) : obj,
				relative = typeof relative === 'string' ? document.getElementById(relative) : relative;
			if(o.getBoundingClientRect){
				var offset = this.getOffsets(o), 
					scroll = this.getScrolls(o);
				var position = {
					x : offset.x - scroll.x,
					y : offset.y - scroll.y
				};
	
				if (relative) {
					var relativePosition = this.getPosition(relative);
					return {
						x : position.x - relativePosition.x - parseInt(Element.getStyle(relative,'border-left-width')),
						y : position.y - relativePosition.y - parseInt(Element.getStyle(relative,'border-top-width'))
					};
				}
				return position;
			}
			var x=0,
				y=0;
			while(o){
				x+=o.offsetLeft;
				y+=o.offsetTop;
				o = o.offsetParent;
			}
			return {x:x,y:y}
		},
		getOffsets : function(obj){
			
			var bound = obj.getBoundingClientRect(), 
				htmlScroll = {
					x : window.pageXOffset || document.documentElement.scrollLeft,
					y : window.pageYOffset || document.documentElement.scrollTop,
					left : document.documentElement.clientLeft || document.body.clientLeft,
					top : document.documentElement.clientTop || document.body.clientTop
				}, 
				elemScrolls = this.getScrolls(obj), 
				isFixed = (this.getStyle(obj,'position') == 'fixed');
			return {
				x : bound.left*1 + elemScrolls.x + ((isFixed) ? 0 : htmlScroll.x) - htmlScroll.left,
				y : bound.top*1 + elemScrolls.y + ((isFixed) ? 0 : htmlScroll.y) - htmlScroll.top
			};
			
		},
		getScrolls :function(obj){
			var element = obj.parentNode, 
				position = {
					x : 0,
					y : 0
				};
			while (element && !isBody(element)) {
				position.x += element.scrollLeft;
				position.y += element.scrollTop;
				element = element.parentNode;
			}
			return position;
		},
		getChild:function(obj,node){
			var o = typeof obj === 'string' ? document.getElementById(obj) : obj,
				list = o.childNodes,
				nodes = [];
			for(var i=0,l=list.length;i<l;i++){
				if(node){
					if(list[i].nodeName == node.toUpperCase()){
						nodes.push(list[i]);
					}
				}else{
					if(list[i].nodeType == 1) nodes.push(list[i])
				}
			}
			o=null;list=null;
			return nodes;
		}
	};
	var ShortStyles = {
			margin : {},
			padding : {},
			border : {},
			borderWidth : {},
			borderStyle : {},
			borderColor : {}
		};
	var ar = ['Top', 'Right', 'Bottom', 'Left'],
		i,l = ar.length;
	for(i=0 ; i<l; i++){
		var Short = ShortStyles;
		Short['margin']['margin'+ar[i]] =  '';
		Short['padding']['padding'+ar[i]] =  '';      
		
		var bd = 'border' + ar[i];
		Short.border[bd] =  '';
		var bdw = bd + 'Width', bds = bd + 'Style', bdc = bd + 'Color';
		Short[bd] = {};
		Short.borderWidth[bdw] = Short[bd][bdw] = '';
		Short.borderStyle[bds] = Short[bd][bds] = '';
		Short.borderColor[bdc] = Short[bd][bdc] = '';
	}
	function isBody(element) {
		return (/^(?:body|html)$/i).test(element.tagName);
	}
	return apollo;
})(window, document);


/*
 * Event
 */
var Event = {
	add : (function(){
		if(document.addEventListener){
			return function(obj,type,fn){ obj.addEventListener(type,fn,false)}
		}
		return function(obj,type,fn){ obj.attachEvent('on'+type,fn)}
	})(),
	remove : (function(){
		if(document.removeEventListener){
			return function(obj,type,fn){ obj.removeEventListener(type,fn,false)}
		}
		return  function(obj,type,fn){ obj.detachEvent('on'+type,fn)}
	})(),
	stop:function(e){
		if(e&&e.stopPropagation){
			e.stopPropagation();
			e.preventDefault();
		}else{
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
	},
	target : function(e){
		e = e || window.event;
		var t = e.target || e.srcElement;
		return t;
	}
}



/*
 * Cookie
 */
var Cookie={
	read:function(name){
		var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
		return (value) ? decodeURIComponent(value[1]) : null;
	},
	write:function(value){
		var str = value.name + '=' + encodeURIComponent(value.value);
			if(value.domain){ str += '; domain=' + value.domain;}
			str += '; path=' + (value.path || '/');
			if(value.day){
				var time = new Date();
				time.setTime(time.getTime()+value.day*24*60*60*1000);
				str += '; expires=' + time.toGMTString();
			}
		document.cookie = str;
		return;
	},
	dispose:function(name,options){
		var opt = options || {};
		opt.name = name;
		opt.day = -1;
		opt.value = 'a';
		this.write(opt);
		return;
	}
}



/*
 * Anima
 */
;(function(){
	var timer = null,
		data = {},
		currentTime,
		total = 0,
		completeNum = 0;

	
	function init(id,options){
		var uid = guid(),
			opt = options || {};
		data[uid] = {
			uid : uid,
			obj : typeof id === 'string' ? document.getElementById(id) : id,
			styles : {
				name : [],
				from : [],
				to : []
			},
			time : opt.time || 500,
			transition : opt.trans || 1,
			transFn : trans(this.transition),
			complete : null,
			state : false
		}
		return uid;
	}

	function guid(){
		return 'xxxxxxx-xxxx-yxxxxxx'.replace(/[xy]/g,function(v){
			var s = Math.random()*16|0,
				c = v == 'x' ? s : (s&0x3|0x8);
			return c.toString(16);
		})
	}
	
	function getTime(){
		return new Date().getTime();
	}

	function start(opt){
		var uid = this.uid;
		data[uid].begintime = getTime();
		data[uid].endtime = data[uid].begintime*1 + data[uid].time*1;
		data[uid].state = true;
		data[uid].styles = {
			name : [],
			from : [],
			to : []
		}
		for(var key in opt){
			if(opt.hasOwnProperty(key)){
				data[uid].styles.name.push(key.hyphenate());
				if(typeof opt[key] === 'object'){
					data[uid].styles.from.push(parseFloat(opt[key][0]));
					data[uid].styles.to.push(parseFloat(opt[key][1]));
					continue;
				}
				var result = Element.getStyle(data[uid].obj,key);
				result = typeof result === 'undefind' ?  opt[key] : result;
				data[uid].styles.from.push(result);
				data[uid].styles.to.push(opt[key]);
				result = null;
			}
		}
		if(!timer){
			timer = setInterval(play,15);
		}
	}

	function play(){
		currentTime = getTime();
		total = 0;
		completeNum = 0;
		for(var key in data){
			if(data.hasOwnProperty(key)){
				total++;
				if(data[key].state === true){
					move(key);
				}else{
					completeNum++;
				}
			}
		}
		render();
		if(total == completeNum){
			clearInterval(timer);
			timer = null;
			total = 0;
			completeNum = 0;
			return;
		}
		
	}

	function move(key){
		data[key].m = (currentTime - data[key].begintime)/data[key].time
		if(data[key].m >= 1){
			data[key].m = 1;
		}

		var str = {},
			n='',
			style = data[key].styles,
			_trans = data[key].transFn(data[key].m);
		for(var i=0,l=style.name.length;i<l;i++){
			if(/(rgb)|(#)/i.test(style.from[i])){
				var froms = setColor(style.from[i]),
					tos = setColor(style.to[i]),
					results = [];
				for(var j=0,k=froms.length;j<k;j++){
					results.push( Math.round(transFun((froms[j]-0),(tos[j]-0),_trans)))
				}
				n =  results.join(',').rgbtoHex();
			}else{
				n = parseFloat(transFun( parseFloat(style.from[i]),parseFloat(style.to[i]),_trans));
			}
			str[style.name[i]] = n;
		}
		data[key].cssText = str;
	}

	function render(){
		for(var key in data){
			if(data.hasOwnProperty(key) && data[key].state === true){
				Element.setStyle(data[key].obj,data[key].cssText);
				if(data[key].m == 1){
					if(data[key].complete){
						try{
							data[key].complete();
						}catch(err){};
					} 
					complete(key);
					complete(key);
				}
			}
		}
	}

	function complete(key){
		data[key].state = false;
		data[key].complete = null;
		data[key].m = 0;
		data[key].styles = {
			name : [],
			from : [],
			to : []
		}
	}

	function setComplete(fn){
		var uid = this.uid;
		data[uid].complete = fn; 
	}

	function stop(uid){
		var uid = uid || this.uid;
		complete(uid);
	}
	function cancel(fn){
		var uid = this.uid;
		if(!data[uid].state) return;
		stop(uid);
		fn && fn();
	}
	function pause(){
		var uid = this.uid,
			current = getTime();
		data[uid].fixTime = current - data[uid].begintime;
		data[uid].state = false;
	}
	function reStart(){
		var uid = this.uid,
			current = getTime();
		data[uid].begintime = current - data[uid].fixTime;
		data[uid].state = true;
	}

	function transFun(f,t,a){
		return f + (t-f)*a;
	}
	
	function setColor(value){
		var result;
		if(value.indexOf('#')>-1){
			value = value.replace(/#/,'');
			if(value.length==3){
				value = value.replace(/(\w)(\w)(\w)/,'$1$1$2$2$3$3');
			}
			result = value.replace(/\w{2}/g,function(m){return parseInt(m.replace(/^0{1}/g,''),16)+','}).replace(/\,$/g,'').split(',');
			return result;
		}
		if(value.indexOf('rgb')>-1){
			result = value.match(/\d{1,3}/g);
		}
		return result;
	}

	function trans(s){
		switch(s){
			case '0':
				return  function(m){return m};
				break;
			case '2':
				return  function(m){return Math.pow(m, 2) * (2.618 * m - 1.618)};
				break;
			case '3' : 
				return  function(m){
					return (m<=0.5) ? Math.pow(m, 2) * (2.618 * m - 1.618) : (1 - Math.pow((1-m),2)*(2.618 * (1-m) - 1.618));
				}
				break;
			case '1' :
			default : 
				return  function (m){ return (1-Math.cos(Math.PI*m))/2 };
		}
	}

	window['Anima'] = function(id,options){
		var uid = init(id,options);
		return {
			start : start,
			stop : stop,
			cancel : cancel,
			pause : pause,
			reStart : reStart,
			complete : setComplete,
			uid : uid
		}
	};
	
})();


/*
 * async loader
 * dom ready
 **/
(function(){
	var loaded = {},
		loadingFiles = {},
		loadList = {},
		mods = {},
		isReady = false,
		readyList = [],
		f = document.getElementsByTagName('script')[0],
		y;
	
	function load(url,charset,callback){
		if(loaded[url]){
			loadingFiles[url] = false;
			callback && callback(url);
			return;
		}
		if(loadingFiles[url]){
			setTimeout(function(){
				load(url,charset,callback);
			},10);
			return;
		}

		loadingFiles[url] = true;
		
		var n,
			done = function(){
				loaded[url] = 1;
				callback && callback(url);
				callback = null;
			},
			t;
		
		t = url.toLowerCase().indexOf('.css') > -1 ? 'css' : 'js';
		if(t === 'css'){
			n = document.createElement('link');
			n.setAttribute('rel','stylesheet');
			n.setAttribute('type','text/css');
			n.setAttribute('href',url);

			var img = new Image();
				img.onerror = function(){
					try{
						done();
					}catch(e){}
					img.onerror = null;
					img = null;
				}
				img.src = url;
		}else{
			n = document.createElement('script');
			n.setAttribute('type','text/javascript');
			n.src = url;
			n.async = true;

			n.onerror = function(){
				console.log(url+' is load fail;');
				try{
					done();
				}catch(e){}
				n.onerror = null;
			}
		}
		
		if(charset){
			n.charset = charset;
		}

		
		n.readyState ? n.onreadystatechange = function(){
			if( /loaded|complete/.test(n.readyState)){
				done();
				n.onreadystatechange = null;
			}
		} : n.onload = function(){
			done();
			n.onload = null;
		}
		
		f.parentNode.insertBefore(n,f);
	}

	function loadDeps(deps,callback){
		var mod, 
			len = deps.length,
			id = deps.join('');

		if(loadList[id]){
			callback && callback();
			return;
		}
		function complete(){
			if(!--len){
				loadList[id] = 1;
				callback && callback();
			}
		}

		for(var i=0,l=deps.length;i<l;i++){
			if(typeof deps[i] === 'string' ){
				mod = (mods[deps[i]]) ? mods[deps[i]] : {path : deps[i]};
			}else{
				mod = deps[i];
			}
			if(mod.requires){
				loadDeps(mod.requires,(function(mod,key){
					return function(){ 
						load(mod.path,mod.charset,function(){ 
							if(mod.callback){
								mod.callback();
								mods[key].callback = null; 
							}
							complete(); 
						});
					}
				})(mod,deps[i]))
			}else{
				load(mod.path,mod.charset,(function(mod,key){ 
					return function(){
						if(mod.callback){
							mod.callback();
							mods[key].callback = null; 
						}
						complete(); 
					}
				})(mod,deps[i]));
			}
		}
	}

	var loader = function(){
		var args = [].slice.call(arguments),
			fn,
			id;

		if(typeof args[args.length-1] === 'function'){
			fn = args.pop();
		}
		if( args.length === 0 ){
			fn && fn();
			return;
		}
		id = args.join('');
		if(loadList[id]){
			fn && fn();
			return;
		}
		loadDeps(args,function(){
			fn && fn();
		})
	}

	loader.add = function(name,value){
		if(!name || !value){
			return;
		}
		var _mod = [];
		if(name === 'mods'){
			for(var key in value){
				if(value.hasOwnProperty(key) && value[key].path){
					mods[key] = value[key];
					_mod.push(key);
				}
			}
		}else if( value.path ){
			mods[name] = value;
			_mod.push(name);
		}
		loadDeps(_mod);
		_mod = null;
	}


    window['Y'] = loader;

	
	/*!
	 * contentloaded.js
	 * Author: Diego Perini (diego.perini at gmail.com)
	 */
	function contentLoaded(fn) {
		var done = false, top = true, win = window,
		doc = win.document, root = doc.documentElement,
		add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		pre = doc.addEventListener ? '' : 'on',
		init = function(e) {
			if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
			(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
			if (!done && (done = true)) fn.call(win, e.type || e);
		},
		poll = function() {
			try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
			init('poll');
		};
		if (doc.readyState == 'complete') fn.call(win, 'lazy');
		else {
			if (doc.createEventObject && root.doScroll) {
				try { top = !win.frameElement; } catch(e) { }
				if (top) poll();
			}
			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}
	}

	contentLoaded(function(){
		isReady = true;	
		fireReadyList();
	});

	function fireReadyList(){
		var i=0,len=readyList.length;
		if(len){
			for( ; readyList[i]; i++){
				readyList[i]();
			}
		}
	}

	window['Domready'] = function(fn){
		if(isReady){
			fn && fn();
			return;
		}
		readyList.push(fn);
	}

})();


/**
 * 
 * Template
 * 
 * **/

;(function(){
	var OUT = ["htmlString='';", "htmlString+=", ";", "htmlString"],
		DICTIONARY = 'break,delete,function,return,typeof,length,'
					+'case,do,if,switch,var,'
					+'catch,else,in,this,void,'
					+'continue,false,instanceof,throw,while,'
					+'debugger,finally,new,true,with,'
					+'default,for,null,try,'
					+'abstract,double,goto,native,static,'
					+'boolean,enum,implements,package,super,'
					+'byte,export,import,private,synchronized,'
					+'char,extends,int,protected,throws,'
					+'class,final,interface,public,transient,'
					+'const,float,long,short,volatile,parseInt,console,log,echo',
		DARR = DICTIONARY.split(',');
	function TemplateEngine(){
		this.openTag = '<@';
		this.closeTag = '@>';
		this.frontStr = 'var ';
		this.repeatDictionary = {};
		this.stop = false;
		this.templateData = {};
		this.keys = {htmlString:true,$data:true};
		for(var i = 0,l = DARR.length;i < l;i++){
			this.keys[DARR[i]] = true;
		}
	}
	TemplateEngine.prototype = {
		exported : function(code){
			var tempCode = '',
				_this = this,
				code = code;

			function exportFront(array,callback) {
				for (var i = 0 , l = array.length; i < l; i++) {
					callback.call(this,array[i], i);
				}
			};
			function exportBehind(code) {
				var code = code.split(_this.closeTag);
				if (code.length === 1) {
					tempCode += _this.htmlStr(code[0]);
				} else {
					tempCode += _this.logicStr(code[0]);
					if (code[1]) {
						tempCode += _this.htmlStr(code[1]);
					}
				}
			};
			exportFront(code.split(this.openTag),exportBehind);
			//return this.frontStr+OUT[0] + tempCode + objName + '.template=' + OUT[3];
			return this.frontStr+OUT[0] + tempCode + 'this.template=' + OUT[3];
		},
		htmlStr : function(code){
			code = code.replace(/>[^<]*<|[^>]*<|>[^<]*/g,function(str){return str.replace(/\s/g,'')});
			if(code.replace(/\s/g,'') == '')return '';
			return OUT[1] + "'" + code.replace(/('|"|\\)/g, '\\$1') + "'" + OUT[2] + '\n';
		},
		logicStr : function(code){
			if (code.indexOf('=') === 0) {
				code = OUT[1]
				+ code.substring(1).replace(/[\s;]*$/, '')
				+ OUT[2];
			}else if(code.split('echo').length > 1){
					var strs = code.split('echo'), _l = strs.length, temCode = strs[0];
					for(var i = 1; i < _l; i++){
						temCode += this.setLogicHtml(strs[i],code);
					}
					code = temCode+strs[_l-1].replace(strs[_l-1].split(';')[0],'');
			}
			this.getKeys(code);
			return code + '\n';
		},
		setLogicHtml : function(s,code){
			var keys = s.split(';')[0];
			code.replace('echo'+keys, '');
			return code = OUT[1]
				+ keys
				+ OUT[2];
		},
		getKeys : function(code){
			var _this = this,
				keys = code.split(/[^\$\w\d]+/);
			for(var i=0,l=keys.length;i<l;i++){
				if(!(keys[i] == "" || /^\d/.test(keys[i]) || this.keys[keys[i]] || this.repeatDictionary[keys[i]] === true )){
					code.split(keys[i-1]+'.'+keys[i]).length == 1 && setKeyValue(keys[i]);
				}
			}
			function setKeyValue(name){
				if(_this.repeatDictionary[name] === true)return;
				var value = '$data["'+name+'"]';
					_this.repeatDictionary[name] = true;
					_this.frontStr += name + '=' + value + ',';
			}
		},
		str2Fn : function(data,str){
			var fn = new Function('$data',str),
				data = data || {};
			this.repeatDictionary = {};
			for(var k in this.templateData){
				data[k] = this.templateData[k];
			}
			this.templateData = {};
			fn.call(this,data);
		},
		assign : function(vars,value){
			if(value != null){
				this.repeatDictionary[vars] = value;
				this.templateData[vars] = value;
			}else{
				if(typeof vars !== 'object' || vars.length){this.stop = true;console.error('Wrong data:' + typeof vars + ':' + vars);return;}
				for(var keys in vars){
					this.repeatDictionary[keys] = vars[keys];
					this.templateData[keys] = vars[keys];
				}
			}
		},
		showLogic : function(){
			this.show = true;
		},
		render : function(tem,data){
			if(this.stop){return;}
			if(!tem || !data){console.error('data or template is lost!');return;}
			var data = data || [],
				logic = this.exported(tem);
			this.show && console.log(logic);
			this.str2Fn(data,logic);
			this.frontStr = 'var ';
			return this.template;
		},
		display : function(tem){
			if(this.stop){return;}
			if(!tem){console.error('template is lost!');return;}
			var logic = this.exported(tem);
			this.show && console.log(logic);
			this.str2Fn(null,logic);
			this.frontStr = 'var ';
			return this.template;
		},
		setTag : function(open,close){
			this.openTag = open;
			this.closeTag = close;
		}
	}
	window['TE'] = function(){
		return new TemplateEngine();
	}
})();


/*********
http request
* request.jsonp(options);
* request.ajax(options);
*********/
var Request=function(){
	function getARandom(){return Math.ceil(1+Math.random()*1e3)*Math.ceil(1+Math.random()*1e3)*Math.ceil(1+Math.random()*1e3)}
	function jsonp(e){
		if(!e){
			console.error("please fill in any parameters first!");return
		}
		if(!e.url){
			console.error("url is required parameters, please check your parameters!");return
		}
		options.setVal(e);
		_callbackfn= options.jsonpName || "jsonpCallbackFunctionNo"+(new Date).getTime()+"_"+getARandom();
		window[_callbackfn] = options.success;
		create();
	}
	function create(){var e=document.createElement("script"),t=/[\?]/g.test(options.url)?"&":"?",n=head?head:head=document.getElementsByTagName("head")[0];for(var r in options.data)t+=r+"="+options.data[r]+"&";t=t+"callback="+_callbackfn,e.async=!0,e.src=options.url+(t=="?"?"":t),n.appendChild(e)}
	function ajax(e){if(!e){console.error("please fill in any parameters first!");return}if(!e.url){console.error("url is required parameters, please check your parameters!");return}if(!e.success||typeof e.success!="function"){console.error("the callback function is lost!");return}options.setVal(e),send()}
	function XMLHTTP(){var e;try{e=new XMLHttpRequest}catch(t){try{e=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){e=new ActiveXObject("Microsoft.XMLHTTP")}}return e?e:!1}
	function send(){var xmlHttp=XMLHTTP(),argStr=/[\?]/g.test(options.url)?"&":"?",_this=this,length=options.data?options.data.length:0;for(var key in options.data)argStr+=key+"="+options.data[key]+"&";argStr=argStr.replace(/\&$/g,""),options.type.toUpperCase()=="GET"?xmlHttp.open(options.type,options.url+(argStr==""?"":argStr),options.async):xmlHttp.open(options.type,options.url,options.async),xmlHttp.setRequestHeader("Content-Type",options.contentType),xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4)if(xmlHttp.status==200||xmlHttp.status==0){if(typeof options.success=="function"){var responseData=xmlHttp.responseText;options.dataType.toLowerCase()=="json"?responseData=eval("("+responseData+")"):options.dataType.toLowerCase()!="text"&&(responseData=xmlHttp.responseXML),options.avatar?options.success.call(options.avatar,responseData):options.success(responseData)}xmlHttp=null}else typeof options.error=="function"&&options.error("Server Status: "+xmlHttp.status)},xmlHttp.send(options.type.toUpperCase()=="POST"?argStr.replace('?',''):null)}
	var options={
			type:"GET",
			dataType:"text",
			async:!0,
			avatar:null,
			contentType:"application/x-www-form-urlencoded",
			url:"about:blank",
			data:{},
			jsonpName:null,
			success:null,
			error:null,
			setVal:function(e){for(var t in e)this[t]=e[t]}
		},
		_callbackfn,head;
	return{jsonp:jsonp,ajax:ajax}
};
(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD support.
		define([], factory);
	} else if (typeof exports === 'object') {
		// NodeJS support.
		module.exports = factory();
	} else {
		// Browser global support.
		root.MobileLogger = factory();
	}
}(this, function() {
	'use strict'
	var htmlspecialchars = function(s){
		var M={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
		return s.replace(/[&<>"']/g,function(m){return M[m]});
	}
	var _slice = Array.prototype.slice;
	var logText = '';
	var elem = undefined;
	var autoScroll = true;
	var logHandler = function(e){
		var t = htmlspecialchars(String(e));
		if (!elem) {
			logText += t+'\n';
			return;
		}
		try {
			elem.innerHTML += t+'\n';
			if (autoScroll) {
				elem.scrollTop = elem.scrollHeight;
				elem.scrollLeft = 0;
			}
		} catch(e) {
			elem = undefined;
			throw e;
		}
	}
	var consoleLog = console.log;
	var consoleWarn = console.warn;
	var consoleDir = console.dir;
	var consoleError = console.error;
	console.log = function(){
		var arg = arguments;
		try{
			consoleLog(arg.length > 1 ? arg : arg[0]);
		}catch(e){}
		logHandler(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]);
	}
	console.warn = function(){
		var arg = arguments;
		try{
			consoleWarn(arg.length > 1 ? arg : arg[0]);
		}catch(e){}
		logHandler('[Warn] '+(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]));
	}
	console.dir = function(){
		var arg = arguments;
		try{
			consoleDir(arg.length > 1 ? arg : arg[0]);
		}catch(e){}
		for (var i = 0; i < arg.length; i++){
			var e = arg[i];
			if ('object' == typeof(e) && null !== e) {
				for (var k in e) {
					logHandler('['+typeof(e[k])+'] '+k+': '+String(e[k])+'');
				}
			} else {
				logHandler(e);
			}
		}
	}
	console.error = function(){
		var arg = arguments;
		try{
			consoleError(arg.length > 1 ? arg : arg[0]);
		}catch(e){}
		logHandler('[Error] '+(arg.length > 1 ? _slice.call(arg).join(' ') : arg[0]));
	}
	window.addEventListener('error', function(e){
		logHandler('[Error] '+e.message+'\n'+e.filename+' : '+e.lineno);
	});
	return {
		bind : function(e){
			if (undefined !== elem) {
				throw new Error('Element already bound');
			}
			try {
				if (!e || !e.nodeName) {
					throw new Error('Invalid DOM element');
				}
				elem = e;
				var estyle = elem.style;
				estyle.whiteSpace = 'pre';
				estyle.overflow = 'auto';
				elem.innerHTML = logText;
				if (autoScroll) {
					elem.scrollTop = elem.scrollHeight;
					elem.scrollLeft = 0;
				}
				logText = '';
			} catch(e) {
				elem = undefined;
				throw new Error('Initialization Failed: ' + e.message);
			}
		},
		autoScroll : function(toggle){
			autoScroll = toggle;
		},
		unbind : function(){
			if (undefined === elem) {
				throw new Error('Element already unbound');
			}
			elem = undefined;
		},
	};
}));

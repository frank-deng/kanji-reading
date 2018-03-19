export const Lang = function(data){
	var langAvail = [];
	for (var l in data) {
		langAvail.push(l);
	}
	var n = navigator;
	var lang = (n.language || n.userLanguage).slice(0,2);
	if (!data[lang]) {
		lang = langAvail[0];
    }

	this.get = function(key){
		var mainRes = data[lang][key];
		if (mainRes) {
			return mainRes;
		} else {
			return data[langAvail[0]][key];
		}
	}
	this.getAll = function(){
		return data[lang];
	}
}
export const base62Encode = function(str) {
	var DATA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var n = 0, len = str.length;
	for(var i = 0; i < len; i++){
		n = n * 62 + DATA.indexOf(str[i]);
	}
	return n;
}
export const base62Decode = function(str) {
	var DATA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var n = 0, len = str.length;
	for(var i = 0; i < len; i++){
		n = n * 62 + DATA.indexOf(str[i]);
	}
	return n;
}



export function Lang(data){
	this.langAvail = [];
	this.data=data;
	for (var l in data) {
		this.langAvail.push(l);
	}
	var n = navigator;
	this.lang = (n.language || n.userLanguage).slice(0,2);
	if (!this.data[this.lang]) {
		this.lang = langAvail[0];
	}
}
Lang.prototype.get=function(key){
	try{
		return this.data[this.lang][key] || this.data[this.langAvail[0]][key] || key;
	}catch(e){
		console.error(e);
	}
	return key;
}
export function base62Decode(str) {
	var DATA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var n = 0, len = str.length;
	for(var i = 0; i < len; i++){
		n = n * 62 + DATA.indexOf(str[i]);
	}
	return n;
}

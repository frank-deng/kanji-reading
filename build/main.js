'use strict'
/* Master classes */
function Lang(data){
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
function kana2Romaji(kana){
	var convtab = {
		'あ':'A','い':'I','う':'U','え':'E','お':'O',
        'か':'KA','き':'KI','く':'KU','け':'KE','こ':'KO',
        'さ':'SA','し':'SHI','す':'SU','せ':'SE','そ':'SO',
        'た':'TA','ち':'CHI','つ':'TSU','て':'TE','と':'TO',
        'な':'NA','に':'NI','ぬ':'NU','ね':'NE','の':'NO',
        'は':'HA','ひ':'HI','ふ':'FU','へ':'HE','ほ':'HO',
        'ま':'MA','み':'MI','む':'MU','め':'ME','も':'MO',
        'や':'YA','ゆ':'YU','よ':'YO',
        'ら':'RA','り':'RI','る':'RU','れ':'RE','ろ':'RO',
        'わ':'WA','を':'WO',
        'が':'GA','ぎ':'GI','ぐ':'GU','げ':'GE','ご':'GO',
        'ざ':'ZA','じ':'JI','ず':'ZU','ぜ':'ZE','ぞ':'ZO',
        'だ':'DA','ぢ':'DI','づ':'DU','で':'DE','ど':'DO',
        'ば':'BA','び':'BI','ぶ':'BU','べ':'BE','ぼ':'BO',
        'ぱ':'PA','ぴ':'PI','ぷ':'PU','ぺ':'PE','ぽ':'PO',
        'きゃ':'KYA','きゅ':'KYU','きょ':'KYO',
        'ぎゃ':'GYA','ぎゅ':'GYU','ぎょ':'GYO',
        'しゃ':'SHA','しゅ':'SHU','しょ':'SHO',
        'じゃ':'JA','じゅ':'JU','じょ':'JO',
        'ちゃ':'CHA','ちゅ':'CHU','ちょ':'CHO',
        'ぢゃ':'DYA','ぢゅ':'DYU','ぢょ':'DYO',
        'にゃ':'NYA','にゅ':'NYU','にょ':'NYO',
        'ひゃ':'HYA','ひゅ':'HYU','ひょ':'HYO',
        'びゃ':'BYA','びゅ':'BYU','びょ':'BYO',
        'ぴゃ':'PYA','ぴゅ':'PYU','ぴょ':'PYO',
        'みゃ':'MYA','みゅ':'MYU','みょ':'MYO',
        'りゃ':'RYA','りゅ':'RYU','りょ':'RYO',
        'ふぁ':'FA','ふぃ':'FI','ふぇ':'FE','ふぉ':'FO',
        'ん':'N',
	}
	var result = '';
	if (!kana) {
		return '';
	}
	while (kana.length > 0) {
		var m1 = kana.charAt(0);
		var m2 = kana.slice(0,2);
		if ('っ' == m1) {
			result += '@';
			kana = kana.slice(1);
	    } else if (2 == m2.length && convtab[m2]) {
		    result += convtab[m2];
		    kana = kana.slice(2);
		} else if (1 == m1.length && convtab[m1]) {
		    result += convtab[m1];
		    kana = kana.slice(1);
        } else {
            result += kana.charAt(0);
            kana = kana.slice(1);
        }
    }
    return result.replace(/@(\w)/g, '$1$1');
}
function KanjiReading(data) {
	var kanjiData = data;
	var getKanjiReading = function(character) {
		var kanjiCode = character.charCodeAt(0).toString(16).toUpperCase();

		//Kanji found
		var kanjiReading = kanjiData.r[kanjiCode];
		if (kanjiReading) {
			var result = {};
			if (kanjiReading.on) {
				result['on'] = [];
				for (var i = 0; i < kanjiReading.on.length; i++){
					result['on'].push(kanjiReading.on[i]);
				}
			}
			if (kanjiReading.kun) {
				result['kun'] = [];
				for (var i = 0; i < kanjiReading.kun.length; i++){
					result['kun'].push(kanjiReading.kun[i]);
				}
			}
			result['kanji'] = character;
			return result;
		}

		//Character with Kanji variant found
		var kanjiCode = kanjiData.v[kanjiCode];
		if (!kanjiCode) {
			return undefined;
		}

		kanjiReading = kanjiData.r[kanjiCode];
		if (kanjiReading) {
			var result = {
				kanji:String.fromCharCode(parseInt(kanjiCode, 16)),
				origInput:character,
			};
			if (kanjiReading.on) {
				result['on'] = kanjiReading.on;
			}
			if (kanjiReading.kun) {
				result['kun'] = kanjiReading.kun;
			}
			return result;
		}

		return undefined;
	}
	this.getFromText = function(text) {
		if ('string' !== typeof text) {
			return undefined;
		}
		var result = {};
		for (var i = 0; i < text.length; i++) {
			var kanji = text.charAt(i);
			if (result[kanji]) {
				continue;
			}
			var kanjiReading = getKanjiReading(kanji);
			if (kanjiReading) {
				result[kanji] = kanjiReading;
			}
		}
		return result;
	}
}

/* Data extraction */
function base62decode(d){
	var n=0,D='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i=0;i<d.length;i++){
		n=n*62+D.indexOf(d[i]);
	}
	return n;
}
function extractKanaData(data){
	if (Array.isArray(data)) {
		var result = [], len = data.length;
		for (var i = 0; i < len; i++) {
			result.push(extractKanaData(data[i]));
		}
		return result;
	}

	var convtab = {
		'0':'あ','1':'い','2':'う','3':'え','4':'お',
		'5':'ぁ','6':'ぃ','7':'ぅ','8':'ぇ','9':'ぉ',
		'A':'か','B':'き','C':'く','D':'け','E':'こ',
		'F':'さ','G':'し','H':'す','I':'せ','J':'そ',
		'K':'た','L':'ち','M':'つ','N':'て','O':'と',
		'P':'な','Q':'に','R':'ぬ','S':'ね','T':'の',
		'U':'は','V':'ひ','W':'ふ','X':'へ','Y':'ほ',
		'Z':'ま','a':'み','b':'む','c':'め','d':'も',
		'e':'や','f':'ゆ','g':'よ',
		'h':'ら','i':'り','j':'る','k':'れ','l':'ろ',
		'm':'わ','n':'を',
		'o':'が','p':'ぎ','q':'ぐ','r':'げ','s':'ご',
		't':'ざ','u':'じ','v':'ず','w':'ぜ','x':'ぞ',
		'y':'だ','z':'ぢ','!':'づ','#':'で','$':'ど',
		'%':'ば','&':'び','(':'ぶ',')':'べ','*':'ぼ',
		'+':'ぱ','-':'ぷ','.':'ぴ','/':'ぺ',':':'ぽ',
		';':'ん','<':'ゃ','=':'ゅ','>':'ょ','?':'っ',
	}
	var result = '';
	var len = data.length;
	for (var i = 0; i < len; i++) {
		result += convtab[data[i]];
	}
	return result;
}
function processData(inputData){
	var data = [];
	data = inputData.split("\n");
	var dataLen = data.length;
	var result = {'r':[], 'v':[]};
	var task = undefined;
	for (var i = 0; i < dataLen; i++){
		var text = data[i];
		if (text == '[Readings]') {
			task = 'r';
		} else if (text == '[Variants]') {
			task = 'v';
		} else if (task == 'r') {
			var kanji = base62decode(text.slice(0,3)).toString(16).toUpperCase();
			var reading = text.slice(3).split('\t');
			result['r'][kanji] = {}
			if (reading[0]) {
				result['r'][kanji]['on'] = extractKanaData(reading[0].split(','));
			}
			if (reading[1]) {
				result['r'][kanji]['kun'] = extractKanaData(reading[1].split(','));
			}
		} else if (task == 'v') {
			var charSrc = base62decode(text.slice(0,3)).toString(16).toUpperCase();
			var charDest = base62decode(text.slice(3,6)).toString(16).toUpperCase();
			result['v'][charSrc] = charDest;
		}
	}
	return result;
}

/* View handling */
var lang = new Lang({
	en:{
		title:'Japanese Kanji Readings',
		prompt:'Input Kanji',
		onReading:'On Reading:',
		kunReading:'Kun Reading:',
	},
	zh:{
		title:'日文汉字读音查询工具',
		prompt:'请输入待查询的汉字',
		onReading:'音读:',
		kunReading:'训读:',
	},
	ja:{
		title:'漢字の読み方',
		prompt:'漢字を入力してください',
		onReading:'音読み:',
		kunReading:'訓読み:',
	},
});
var d = document;
d.title = lang.get('title');

var kanjiReading = undefined;
var drawReadings = function(td, readings){
	for (var i=0; i<readings.length; i++) {
		var span = d.createElement('span');
		span.innerHTML = readings[i]+'<u> '+kana2Romaji(readings[i])+'</u>';
		td.appendChild(span);
	}
}
var drawKanjiRecord = function(kanji){
	var h3 = d.createElement('h3');
	h3.innerHTML = kanji.kanji;
	if (kanji.origInput) {
		h3.innerHTML += '<i>（'+kanji.origInput+'）</i>';
	}

	var table = d.createElement('table');
	if (kanji.on){
		var row = table.insertRow(-1);
		var th = d.createElement('th');
		th.innerHTML = lang.get('onReading');
		row.appendChild(th);
		var td = d.createElement('td');
		drawReadings(td, kanji.on);
		row.appendChild(td);
	}
	if (kanji.kun){
		var row = table.insertRow(-1);
		var th = d.createElement('th');
		th.innerHTML = lang.get('kunReading');
		row.appendChild(th);
		var td = d.createElement('td');
		drawReadings(td, kanji.kun);
		row.appendChild(td);
	}

	var record = d.createElement('p');
	record.appendChild(h3);
	record.appendChild(table);
	return record;
}
var drawRecords = function(dom,text){
	dom.innerHTML = '';
	if (!kanjiReading){
		return;
	}
	var res = kanjiReading.getFromText(text);
	for (var k in res) {
		dom.appendChild(drawKanjiRecord(res[k]));
	}
}

var xhr=new XMLHttpRequest();
xhr.addEventListener('readystatechange', function(){
	if (this.readyState == 4 && this.status == 200) {
		d.body.removeAttribute('loading');
		kanjiReading = new KanjiReading(processData(this.response));
	}
});
xhr.open('GET', 'readings.txt');
xhr.send();
window.addEventListener('load', function(){
	var kanji_search = d.getElementById('kanji_search');
	var search_result = d.getElementById('search_result');
	kanji_search.setAttribute('placeholder', lang.get('prompt'));
	kanji_search.addEventListener('input', function(){
		drawRecords(search_result, this.value);
	});
	kanji_search.addEventListener('change', function(){
		drawRecords(search_result, this.value);
	});
	kanji_search.addEventListener('blur', function(){
		drawRecords(search_result, this.value);
	});
});


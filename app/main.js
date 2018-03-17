import {Lang, base62Decode, kanaToRomaji, extractKanaData} from './util';

/* Master classes */
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
			var kanji = base62Decode(text.slice(0,3)).toString(16).toUpperCase();
			var reading = text.slice(3).split('\t');
			result['r'][kanji] = {}
			if (reading[0]) {
				result['r'][kanji]['on'] = extractKanaData(reading[0].split(','));
			}
			if (reading[1]) {
				result['r'][kanji]['kun'] = extractKanaData(reading[1].split(','));
			}
		} else if (task == 'v') {
			var charSrc = base62Decode(text.slice(0,3)).toString(16).toUpperCase();
			var charDest = base62Decode(text.slice(3,6)).toString(16).toUpperCase();
			result['v'][charSrc] = charDest;
		}
	}
	return result;
}

/* View handling */
var lang = new Lang({
	en : {
		title:'Japanese Kanji Readings',
		prompt:'Input Kanji',
		onReading:'On Reading:',
		kunReading:'Kun Reading:',
	},
	zh : {
		title:'日文汉字读音查询工具',
		prompt:'请输入待查询的汉字',
		onReading:'音读:',
		kunReading:'训读:',
	},
	ja : {
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
		span.innerHTML = readings[i]+'<u> '+kanaToRomaji(readings[i])+'</u>';
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


import {Lang, base62Decode} from './util';
import {kanaToRomaji, extractKanaData} from './kana';

/* Master classes */
function KanjiReading(data){
	this.kanjiData = data;
}
let KanjiReadingPrototype=KanjiReading.prototype;
KanjiReadingPrototype.getKanjiReading=function(character){
	let kanjiCode = character.charCodeAt(0).toString(16).toUpperCase(), kanjiVariantCode=null;
	let kanjiReading = this.kanjiData.r[kanjiCode];

	//If current character not found, find it's corresponding variant character
	if(!kanjiReading){
		kanjiVariantCode = this.kanjiData.v[kanjiCode];
		kanjiReading = this.kanjiData.r[kanjiVariantCode];
	}

	//Reading info not found
	if (!kanjiReading) {
		return undefined;
	}

	//Reading info found
	return {
		kanji:(kanjiVariantCode ? String.fromCharCode(parseInt(kanjiVariantCode, 16)) : character),
		origInput: kanjiVariantCode ? character : null,
		on:kanjiReading.on,
		kun:kanjiReading.kun
	};
}
KanjiReadingPrototype.getFromText=function(text){
	if ('string' !== typeof text) {
		return undefined;
	}
	var result = {};
	for (var i = 0; i < text.length; i++) {
		var kanji = text.charAt(i);
		if (result[kanji]) {
			continue;
		}
		var kanjiReading = this.getKanjiReading(kanji);
		if (kanjiReading) {
			result[kanji] = kanjiReading;
		}
	}
	return result;
}
/*
class KanjiReading{
	constructor(data){
		this.kanjiData = data;
	}
	getKanjiReading(character) {
		let kanjiCode = character.charCodeAt(0).toString(16).toUpperCase(), kanjiVariantCode=null;
		let kanjiReading = this.kanjiData.r[kanjiCode];

		//If current character not found, find it's corresponding variant character
		if(!kanjiReading){
			kanjiCode = kanjiVariantCode = this.kanjiData.v[kanjiCode];
			kanjiReading = this.kanjiData.r[kanjiVariantCode];
		}

		//Reading info not found
		if (!kanjiReading) {
			return undefined;
		}

		//Reading info found
		return {
			kanji:(kanjiVariantCode ? String.fromCharCode(parseInt(kanjiCode, 16)) : character),
			origInput: kanjiVariantCode ? character : null,
			on:kanjiReading.on,
			kun:kanjiReading.kun
		};
	}
	getFromText(text){
		if ('string' !== typeof text) {
			return undefined;
		}
		var result = {};
		for (var i = 0; i < text.length; i++) {
			var kanji = text.charAt(i);
			if (result[kanji]) {
				continue;
			}
			var kanjiReading = this.getKanjiReading(kanji);
			if (kanjiReading) {
				result[kanji] = kanjiReading;
			}
		}
		return result;
	}
}
*/
function processData(inputData){
	var result = {r:[], v:[]};
	var rdata=READINGS_DATA.split('~');
	var dataLen = rdata.length;
	for (var i = 0; i < dataLen; i++){
		var text = rdata[i];
		var kanji = base62Decode(text.slice(0,3)).toString(16).toUpperCase();
		var reading = text.slice(3).split('|');
		result.r[kanji] = {}
		if (reading[0]) {
			result.r[kanji]['on'] = extractKanaData(reading[0].split(','));
		}
		if (reading[1]) {
			result.r[kanji]['kun'] = extractKanaData(reading[1].split(','));
		}
	}
	var vdata=VARIANTS_DATA;
	dataLen=vdata.length;
	for (var i = 0; i < dataLen; i+=6){
		var charSrc = base62Decode(vdata.slice(i,i+3)).toString(16).toUpperCase();
		var charDest = base62Decode(vdata.slice(i+3,i+6)).toString(16).toUpperCase();
		result.v[charSrc] = charDest;
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

var kanjiReading = new KanjiReading(processData());
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

var kanji_search = d.getElementById('kanji_search');
var search_result = d.getElementById('search_result');
kanji_search.setAttribute('placeholder', lang.get('prompt'));
function handler(){
	drawRecords(search_result, kanji_search.value);
}
kanji_search.addEventListener('input', handler);
kanji_search.addEventListener('change', handler);
kanji_search.addEventListener('blur', handler);
handler();

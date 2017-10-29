'use strict'
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
					result['on'].push(romaji2kanji(kanjiReading.on[i]));
				}
			}
			if (kanjiReading.kun) {
				result['kun'] = [];
				for (var i = 0; i < kanjiReading.kun.length; i++){
					result['kun'].push(romaji2kanji(kanjiReading.kun[i]));
				}
			}
			result['kanji'] = character;
			return result;
		}

		//Character with Kanji varient found
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
				result['on'] = [];
				for (var i = 0; i < kanjiReading.on.length; i++){
					result['on'].push(romaji2kanji(kanjiReading.on[i]));
				}
			}
			if (kanjiReading.kun) {
				result['kun'] = [];
				for (var i = 0; i < kanjiReading.kun.length; i++){
					result['kun'].push(romaji2kanji(kanjiReading.kun[i]));
				}
			}
			return result;
		}

		return undefined;
	}
	this.getFromText = function(text) {
		if ('string' !== typeof text) {
			return undefined;
		}
		var dupCharChecker = {};
		var result = [];
		for (var i = 0; i < text.length; i++) {
			var kanji = text.charAt(i);
			if (dupCharChecker[kanji]) {
				continue;
			}
			var kanjiReading = getKanjiReading(kanji);
			if (kanjiReading) {
				dupCharChecker[kanji] = true;
				result.push(kanjiReading);
			}
		}
		return result;
	}
}
function romaji2kanji(romaji){
	var romajiData = {
		'A':'あ','I':'い','U':'う','E':'え','O':'お',
		'KA':'か','KI':'き','KU':'く','KE':'け','KO':'こ',
		'SA':'さ','SHI':'し','SU':'す','SE':'せ','SO':'そ',
		'TA':'た','CHI':'ち','TSU':'つ','TE':'て','TO':'と',
		'NA':'な','NI':'に','NU':'ぬ','NE':'ね','NO':'の',
		'HA':'は','HI':'ひ','HU':'ふ','FU':'ふ','HE':'へ','HO':'ほ',
		'MA':'ま','MI':'み','MU':'む','ME':'め','MO':'も',
		'YA':'や','YU':'ゆ','YO':'よ',
		'RA':'ら','RI':'り','RU':'る','RE':'れ','RO':'ろ',
		'WA':'わ','WO':'を',
		'GA':'が','GI':'ぎ','GU':'ぐ','GE':'げ','GO':'ご',
		'ZA':'ざ','JI':'じ','ZU':'ず','ZE':'ぜ','ZO':'ぞ',
		'DA':'だ','DI':'ぢ','DU':'づ','DE':'で','DO':'ど',
		'BA':'ば','BI':'び','BU':'ぶ','BE':'べ','BO':'ぼ',
		'PA':'ぱ','PI':'ぴ','PU':'ぷ','PE':'ぺ','PO':'ぽ',
		'KYA':'きゃ','KYU':'きゅ','KYO':'きょ','GYA':'ぎゃ','GYU':'ぎゅ','GYO':'ぎょ',
		'SHA':'しゃ','SHU':'しゅ','SHO':'しょ','SYA':'しゃ','SYU':'しゅ','SYO':'しょ',
		'JA':'じゃ','JU':'じゅ','JO':'じょ','JYA':'じゃ','JYU':'じゅ','JYO':'じょ',
		'CHA':'ちゃ','CHU':'ちゅ','CHO':'ちょ','DYA':'ぢゃ','DYU':'ぢゅ','DYO':'ぢょ',
		'NYA':'にゃ','NYU':'にゅ','NYO':'にょ','HYA':'ひゃ','HYU':'ひゅ','HYO':'ひょ',
		'BYA':'びゃ','BYU':'びゅ','BYO':'びょ','PYA':'ぴゃ','PYU':'ぴゅ','PYO':'ぴょ',
		'MYA':'みゃ','MYU':'みゅ','MYO':'みょ','RYA':'りゃ','RYU':'りゅ','RYO':'りょ',
		'N':'ん',
	}
	var result = '';
	romaji = romaji.toUpperCase();
	while (romaji.length > 0) {
		var matched = false;
		for (var idx in romajiData) {
			var kana = romajiData[idx];
			if (!matched && 0 == romaji.indexOf(idx)) {
				romaji = romaji.slice(idx.length);
				result += kana;
				matched = true;
				break;
			}
		}
		if (!matched){
			result += romaji.charAt(0);
			romaji = romaji.slice(1);
		}
	}
	return result;
}

Vue.component('show-result', {
	template: '#show_result',
});
var view = new Vue({
    el: '#vue_master',
	data {
		kanji_search:'',
	},
	methods : {
		processInput : function(){

			show_result.innerHTML = displayKanjiReading({data:kanjiReading.getFromText(this.kanji_search)});
		}
	}
});

var kanjiReading = undefined;
var displayKanjiReading = _.template(document.getElementById('show_result_template').innerHTML);

var kanji_search = document.getElementById('kanji_search');
var show_result = document.getElementById('show_result');
document.getElementById('menu_btn').addEventListener('click', function(event){
	event.stopPropagation();
	if (document.body.getAttribute('showmenu')) {
		document.body.removeAttribute('showmenu');
	} else {
		document.body.setAttribute('showmenu', 'showmenu');
	}
	return false;
});
document.getElementById('main_menu').addEventListener('click', function(event){
	event.stopPropagation();
	return false;
});
document.body.addEventListener('click', function(event){
	document.body.removeAttribute('showmenu');
});

var processInput = _.throttle(function(e){
}, 100)
kanji_search.addEventListener('input', processInput);
kanji_search.addEventListener('change', processInput);
kanji_search.addEventListener('keydown', processInput);

var xhr=new XMLHttpRequest();
xhr.addEventListener('readystatechange', function(){
	if (this.readyState == 4 && this.status == 200) {
		kanjiReading = new KanjiReading(JSON.parse(this.responseText));
		document.body.removeAttribute('loading');
		processInput();
	}
});
var loading_progress = document.getElementById('loading_progress');
xhr.addEventListener('progress', _.throttle(function(e){
	loading_progress.style.width=Math.round(e.loaded/e.total*100)+'%';
}, 50));
xhr.open('GET', 'readings.json');
xhr.send();


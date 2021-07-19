import {Lang} from './util';
window.lang = new Lang({
	en : {
		title:'Japanese Kanji Readings',
        loading:'Loading Data...',
		prompt:'Input Kanji',
		onReading:'On Reading:',
		kunReading:'Kun Reading:',
	},
	zh : {
		title:'日文汉字读音查询工具',
        loading:'数据加载中……',
		prompt:'请输入待查询的汉字',
		onReading:'音读:',
		kunReading:'训读:',
	},
	ja : {
		title:'漢字の読み方',
        loading:'データロード中……',
		prompt:'漢字を入力してください',
		onReading:'音読み:',
		kunReading:'訓読み:',
	},
});
var d = document;
d.title = lang.get('title');
d.getElementById('kanji_search').setAttribute('placeholder', lang.get('prompt'));
d.getElementById('loading_text').innerHTML=lang.get('loading');

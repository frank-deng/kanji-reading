export const kanaToRomaji = function(kana){
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
export const romajiToKana = function(romaji){
	var convtab = {
		'A':'あ','I':'い','U':'う','E':'え','O':'お',
		'KA':'か','KI':'き','KU':'く','KE':'け','KO':'こ',
		'SA':'さ','SHI':'し','SU':'す','SE':'せ','SO':'そ',
		'TA':'た','CHI':'ち','TI':'ち','TU':'つ','TSU':'つ','TE':'て','TO':'と',
		'NA':'な','NI':'に','NU':'ぬ','NE':'ね','NO':'の',
		'HA':'は','HI':'ひ','HU':'ふ','FU':'ふ','HE':'へ','HO':'ほ',
		'MA':'ま','MI':'み','MU':'む','ME':'め','MO':'も',
		'YA':'や','YU':'ゆ','YO':'よ',
		'RA':'ら','RI':'り','RU':'る','RE':'れ','RO':'ろ',
		'WA':'わ','WO':'を',
		'GA':'が','GI':'ぎ','GU':'ぐ','GE':'げ','GO':'ご',
		'ZA':'ざ','JI':'じ','ZI':'じ','ZU':'ず','ZE':'ぜ','ZO':'ぞ',
		'DA':'だ','DI':'ぢ','DU':'づ','DE':'で','DO':'ど',
		'BA':'ば','BI':'び','BU':'ぶ','BE':'べ','BO':'ぼ',
		'PA':'ぱ','PI':'ぴ','PU':'ぷ','PE':'ぺ','PO':'ぽ',
		'KYA':'きゃ','KYU':'きゅ','KYO':'きょ',
		'GYA':'ぎゃ','GYU':'ぎゅ','GYO':'ぎょ',
		'SHA':'しゃ','SHU':'しゅ','SHO':'しょ',
		'SYA':'しゃ','SYU':'しゅ','SYO':'しょ',
		'SHYA':'しゃ','SHYU':'しゅ','SHYO':'しょ',
		'JA':'じゃ','JU':'じゅ','JO':'じょ',
		'JYA':'じゃ','JYU':'じゅ','JYO':'じょ',
		'CHA':'ちゃ','CHU':'ちゅ','CHO':'ちょ',
		'CHYA':'ちゃ','CHYU':'ちゅ','CHYO':'ちょ',
		'DYA':'ぢゃ','DYU':'ぢゅ','DYO':'ぢょ',
		'NYA':'にゃ','NYU':'にゅ','NYO':'にょ',
		'HYA':'ひゃ','HYU':'ひゅ','HYO':'ひょ',
		'BYA':'びゃ','BYU':'びゅ','BYO':'びょ',
		'PYA':'ぴゃ','PYU':'ぴゅ','PYO':'ぴょ',
		'MYA':'みゃ','MYU':'みゅ','MYO':'みょ',
		'RYA':'りゃ','RYU':'りゅ','RYO':'りょ',
		'FA':'ふぁ','FI':'ふぃ','FE':'ふぇ','FO':'ふぉ',
		'N':'ん',
	};
	var result = '';
	while (romaji.length > 0) {
		var m1 = romaji.charAt(0), m2 = romaji.slice(0,2), m3 = romaji.slice(0,3), m4 = romaji.slice(0,4);
		if (romaji.length >= 2 && (m2[0] == m2[1]) && ('AEIOU'.indexOf(m1) < 0)){
			result += 'っ';
			romaji = romaji.slice(1);
		} else if (4 == m4.length && convtab[m4]) {
			result += convtab[m4];
			romaji = romaji.slice(4);
		} else if (3 == m3.length && convtab[m3]) {
			result += convtab[m3];
			romaji = romaji.slice(3);
		} else if (2 == m2.length && convtab[m2]) {
			result += convtab[m2];
			romaji = romaji.slice(2);
		} else if (1 == m1.length && convtab[m1]) {
			kanaSeq += convtab[m1];
			romaji = romaji.slice(1);
		} else {
			result += romaji.charAt(0);
			romaji = romaji.slice(1);
		}
	}
	return result;
}

var convtabExtract = {
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
export const extractKanaData = function(data){
	if (Array.isArray(data)) {
		var result = [], len = data.length;
		for (var i = 0; i < len; i++) {
			result.push(extractKanaData(data[i]));
		}
		return result;
	}

	var result = '', len = data.length;
	for (var i = 0; i < len; i++) {
		result += convtabExtract[data[i]];
	}
	return result;
}
export const compressKanaData = function(data){
	if (Array.isArray(data)) {
		var result = [], len = data.length;
		for (var i = 0; i < len; i++) {
			result.push(compressKanaData(data[i]));
		}
		return result;
	}

	var result = '', len = data.length;
	for (var i = 0; i < len; i++) {
		var found = false;
		for (var key in convtabExtract) {
			var val = convtabExtract[key];
			if (val == data[i]) {
				result += key;
				found = true;
				break;
			}
		}
		if (!found){
			result += data[i];
		}
	}
	return result;
}

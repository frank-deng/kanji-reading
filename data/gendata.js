'use-strict'
const Base62 = require('base62');
const fs = require('fs');
import { compressKanaData, romajiToKana } from '../app/kana';

function getKanjiAll(filename) {
    var jsrc = {};
	var kanjiAll = fs.readFileSync(filename, 'utf-8').split('\n');
	for (var i = 0; i < kanjiAll.length; i++) {
		var line = kanjiAll[i].trim();
		if ('#' == line[0] || 0 == line.length) {
			continue;
		}

		var data = line.split('\t');
		var charCode = data[0].replace('U+', '');
		if (charCode.length > 4) {
			continue;
		}
		if (data[1] == 'kIRG_JSource') {
			jsrc[charCode] = true;
		}
	}
    return jsrc;
}
function getReadings(filename, kanjiAll) {
    var result = {};
	var readings = fs.readFileSync(filename, 'utf-8').split('\n');
	for (var i = 0; i < readings.length; i++) {
		var line = readings[i].trim();
		if ('#' == line[0] || 0 == line.length) {
			continue;
		}

		var data = line.split(/\s+/);
		var charCode = data[0].replace('U+', '');
		if (!kanjiAll[charCode] || charCode.length > 4) {
			continue;
		}
		if ((data[1] == 'kJapaneseKun' || data[1] == 'kJapaneseOn') && !result[charCode]) {
			result[charCode] = {};
		}
		if (data[1] == 'kJapaneseKun') {
			result[charCode]['kun'] = Array.from(data.slice(2), romajiToKana);
		} else if (data[1] == 'kJapaneseOn') {
			result[charCode]['on'] = Array.from(data.slice(2), romajiToKana);
		}
	}
    return result;
}
function getVariants(filename, kanjiAll, readings) {
    var tradVariants = {};
	var variants = fs.readFileSync(filename, 'utf-8').split('\n');
	for (var i = 0; i < variants.length; i++) {
		var line = variants[i].trim();
		if ('#' == line[0] || 0 == line.length) {
			continue;
		}

        var data = line.split(/\s+/);
        var charSrc = data[0].replace('U+', '');
        var charDest = data[2].replace('U+', '');
        if (charSrc.length > 4 || charDest.lenght > 4) {
            continue;
		}
		if (data[1] == 'kTraditionalVariant' && readings[charDest] && !readings[charSrc]) {
            tradVariants[charSrc] = charDest;
		}
	}
    return tradVariants;
}

function process(targetFile){
	var kanjiAll = getKanjiAll('./data/Unihan_IRGSources.txt');
	var readings = getReadings('./data/Unihan_Readings.txt', kanjiAll);
	var variants = getVariants('./data/Unihan_Variants.txt', kanjiAll, readings);
	var output = '[Readings]\n';
	for (var i in readings) {
		var r = readings[i];
		var charCode = Base62.encode(parseInt(i, 16));
		var on = '', kun = '';
		if (r['on']) {
			on = Array.from(r['on'], compressKanaData).join(',');
		}
		if (r['kun']) {
			kun = Array.from(r['kun'], compressKanaData).join(',');
		}
		output += `${charCode}${on}\t${kun}\n`;
	}
	output += '[Variants]\n';
	for (var s in variants) {
		var from = Base62.encode(parseInt(s, 16)), to = Base62.encode(parseInt(variants[s], 16));
		output += `${from}${to}\n`;
	}

	fs.writeFileSync(targetFile, output, {flag:'w', encoding:'utf-8', mode:'0600'});
}

process('./readings.txt');

const localStorageKey = 'kanji-readings';
const localStorageSum = '4e7246f657f6871235dd075c358eb49c8b7496387c12bf39cfd37e6c5be370df';

import sha256 from 'js-sha256';
export const loadReadings = function() {
	var localStorage = window.localStorage;
	if (!localStorage) {
		return undefined;
	}
	var data = localStorage.getItem(localStorageKey);
	if (data && sha256(data) == localStorageSum) {
		return data;
	} else {
		return undefined;
	}
}
export const saveReadings = function(data) {
	var localStorage = window.localStorage;
	if (!localStorage) {
		return undefined;
	}
	try{
		localStorage.setItem(localStorageKey, data);
		return true;
	}catch(e){
		return undefined;
	}
}


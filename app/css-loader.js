module.exports = function(content){
	var fs = require("fs");
	var CleanCSS = require('clean-css');
	var css = new CleanCSS().minify(content);
	var result = `
		var cssCode = "${css.styles}";
		var styleElement = document.createElement("style");
		var styleSheet = styleElement.styleSheet;
		if (styleSheet) {
			styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		document.head.appendChild(styleElement);
	`.trim();
	return result;
}

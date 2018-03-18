const loaderUtils = require("loader-utils");
module.exports = function(content){
	const file = loaderUtils.interpolateName(this, filename, { content });
	var fs = require("fs");
	var CleanCSS = require('clean-css');
	var css = new CleanCSS().minify(fs.readFileSync(file));
	var result = `
		var cssCode = "${css.styles}";
		var styleElement = document.createElement("style");
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		document.getElementsByTagName("head")[0].appendChild(styleElement);
	`.trim();
	return result;
}
